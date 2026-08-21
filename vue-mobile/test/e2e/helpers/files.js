const path = require('path')
const { sharedHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const fs = require('fs')
const { expect } = require('@playwright/test')
const { step, attachScreenshot } = sharedHelper('login')
const { waitForListReady, clickReady, clickDrawerItem } = sharedHelper('ready')

const listReadyOptions = {
  itemTestIds: ['files-item', 'files-folder'],
  emptyTestId: 'files-empty',
  spinnerSelectors: [
    '.app-list-loader_initial',
    '.app-list-loader_initial .q-spinner-dots',
  ],
  timeout: 60000,
}

const defaultFixturePath = fixturePath('e2e-attach.txt')

/** Keep under FileItem getShortName(..., 30) so list/search text matches fully. */
function uniqueFileName(prefix) {
  return `${prefix}-${Date.now()}.txt`
}

function uniqueFolderName(prefix) {
  return `${prefix} ${Date.now()}`
}

async function openFiles(page) {
  await clickReady(page.getByTestId('nav-files'))
  await expect(page.getByTestId('files-list')).toBeVisible({
    timeout: 60000,
  })
  await waitForListReady(page, listReadyOptions)
}

async function waitForFilesList(page) {
  await expect(page.getByTestId('files-list')).toBeVisible({
    timeout: 30000,
  })
  await waitForListReady(page, listReadyOptions)
}

async function isFilesSearchOpen(page) {
  return page
    .getByTestId('files-search-input')
    .isVisible()
    .catch(() => false)
}

async function closeFilesSearch(page) {
  if (!(await isFilesSearchOpen(page))) {
    return
  }
  await clickReady(page.getByTestId('files-search-close'))
  await expect(page.getByTestId('files-search-input')).toBeHidden({
    timeout: 15000,
  })
}

/**
 * Open Files search (or reuse open search) and set the query.
 * Leaves search open so filtered results stay visible.
 * Does not call waitForListReady — search empty state ("Nothing found") would
 * otherwise hang when spinners/list settle oddly.
 */
async function searchFiles(page, query) {
  if (!(await isFilesSearchOpen(page))) {
    await clickReady(page.getByTestId('files-search'))
    await expect(page.getByTestId('files-search-input')).toBeVisible({
      timeout: 15000,
    })
  }
  const input = page.getByTestId('files-search-input').locator('input')
  await input.fill('')
  await input.fill(query)
  await page.waitForTimeout(1000)
}

/**
 * Find a file or folder row by name. Uses list first, then search when the
 * Personal list is long / virtualized.
 * @param {'files-item'|'files-folder'} kind
 */
async function locateByName(page, name, kind, { timeout = 60000 } = {}) {
  const row = () => page.getByTestId(kind).filter({ hasText: name }).first()

  if (await row().isVisible().catch(() => false)) {
    return row()
  }

  await searchFiles(page, name)
  await expect(
    row(),
    `Expected ${kind} "${name}" after search (upload/API may have failed)`
  ).toBeVisible({ timeout })
  return row()
}

/**
 * FAB → Upload file. files-upload-file only mounts FileUploader; Quasar
 * pickFiles() opens the chooser asynchronously via $root.uploadFiles.
 */
async function uploadFileViaFab(page, uniqueName, fixturePath = defaultFixturePath) {
  await closeFilesSearch(page).catch(() => undefined)
  await clickReady(page.getByTestId('files-create-fab'))
  const uploadBtn = page.getByTestId('files-upload-file')
  await expect(uploadBtn).toBeVisible({ timeout: 15000 })

  const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 30000 })
  // hasTouch: Playwright click can miss Vue @click on this FAB child.
  await uploadBtn.evaluate((el) => el.click())
  const fileChooser = await fileChooserPromise

  // Multipart UploadFile: postData() may be empty; match URL + content-type.
  const uploadResponsePromise = page.waitForResponse(
    (res) => {
      const req = res.request()
      if (!req.url().includes('Api')) return false
      if (req.method() !== 'POST') return false
      const ct = (req.headers()['content-type'] || '').toLowerCase()
      if (ct.includes('multipart/form-data')) return true
      const post = req.postData() || ''
      return post.includes('UploadFile') || post.includes('jua-uploader')
    },
    { timeout: 90000 }
  )

  await fileChooser.setFiles({
    name: uniqueName,
    mimeType: 'text/plain',
    buffer: fs.readFileSync(fixturePath),
  })

  const resp = await uploadResponsePromise
  const uploadUrl = resp.url()
  if (!resp.ok()) {
    throw new Error(
      `Files.UploadFile HTTP ${resp.status()} for "${uniqueName}" url=${uploadUrl}`
    )
  }
  let body = null
  try {
    body = await resp.json()
  } catch {
    body = null
  }
  // Success: Result is true, or an object with File (UploadFile API shape).
  // HTTP 200 alone is not enough — AuthError 102 also returns 200.
  const uploadOk =
    body &&
    !body.ErrorCode &&
    (body.Result === true || (body.Result && body.Result.File))
  if (!uploadOk) {
    throw new Error(
      `Files.UploadFile failed for "${uniqueName}" url=${uploadUrl}: ${JSON.stringify(body)}`
    )
  }
  console.log(`  → UploadFile OK for ${uniqueName}`)

  // Prefer list poll; fall back to search if the list is long.
  const inList = page.getByTestId('files-item').filter({ hasText: uniqueName }).first()
  const appeared = await inList
    .waitFor({ state: 'visible', timeout: 15000 })
    .then(() => true)
    .catch(() => false)
  if (appeared) {
    return inList
  }

  const item = await locateByName(page, uniqueName, 'files-item', {
    timeout: 60000,
  })
  await closeFilesSearch(page)
  return item
}

async function openFileByName(page, name) {
  const item = await locateByName(page, name, 'files-item', { timeout: 30000 })
  await clickReady(item)
  await expect(page.getByTestId('files-view')).toBeVisible({ timeout: 30000 })
}

async function confirmDeleteDialogIfShown(page) {
  const deleteDialog = page.getByTestId('files-delete-dialog')
  const dialogShown = await deleteDialog
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false)
  if (dialogShown) {
    await clickReady(page.getByTestId('files-delete-confirm'))
    await expect(deleteDialog).toBeHidden({ timeout: 45000 })
  }
}

async function deleteOpenedFile(page, name) {
  await expect(page.getByTestId('files-view-delete')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('files-view-delete'))
  await confirmDeleteDialogIfShown(page)

  // After delete from file view the app must navigate to the list by itself
  // (no manual files-view-back). A blank files-view left on screen is a bug.
  await expect(page.getByTestId('files-view')).toBeHidden({ timeout: 30000 })
  await waitForFilesList(page)
  await expect(
    page.getByTestId('files-item').filter({ hasText: name })
  ).toHaveCount(0, { timeout: 60000 })
}

async function longPressFilesItem(page, item) {
  await item.scrollIntoViewIfNeeded()
  const box = await item.boundingBox()
  if (!box) {
    throw new Error('files item has no bounding box for long-press')
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(750)
  await page.mouse.up()
  // FileList.skipSelectToggleUntil ≈ 500ms after long-press (guards synthetic
  // click on the same row). Wait it out before the next UI action.
  await page.waitForTimeout(550)
}

async function navigateToStorageRoot(page) {
  if (await page.getByTestId('files-view').isVisible().catch(() => false)) {
    await clickReady(page.getByTestId('files-view-back'))
    await waitForFilesList(page)
  }
  await closeFilesSearch(page).catch(() => undefined)
  for (let i = 0; i < 10; i++) {
    const back = page.getByTestId('files-path-back')
    if (!(await back.isVisible().catch(() => false))) break
    await clickReady(back)
    await waitForFilesList(page)
  }
}

async function createFolderViaFab(page, folderName) {
  await closeFilesSearch(page).catch(() => undefined)
  await clickReady(page.getByTestId('files-create-fab'))
  await clickReady(page.getByTestId('files-create-folder'))
  await expect(page.getByTestId('files-create-folder-dialog')).toBeVisible({
    timeout: 15000,
  })
  await page
    .getByTestId('files-create-folder-name')
    .locator('input')
    .fill(folderName)
  await clickReady(page.getByTestId('files-create-folder-submit'))
  await expect(page.getByTestId('files-create-folder-dialog')).toBeHidden({
    timeout: 45000,
  })
  await waitForFilesList(page)
  const folder = await locateByName(page, folderName, 'files-folder', {
    timeout: 60000,
  })
  await closeFilesSearch(page)
  return folder
}

async function deleteFolderIfPresent(page, folderName) {
  await closeFilesSearch(page).catch(() => undefined)
  await waitForFilesList(page)

  let folder = page
    .getByTestId('files-folder')
    .filter({ hasText: folderName })
    .first()
  if (!(await folder.isVisible().catch(() => false))) {
    await searchFiles(page, folderName)
    folder = page
      .getByTestId('files-folder')
      .filter({ hasText: folderName })
      .first()
    if (!(await folder.isVisible().catch(() => false))) {
      await closeFilesSearch(page).catch(() => undefined)
      return
    }
  }

  await clickReady(folder.getByTestId('files-folder-more'))
  const del = page.getByTestId('files-item-menu-delete')
  if ((await del.count()) === 0) {
    console.log('  → No delete in folder menu; leave folder')
    await page.keyboard.press('Escape').catch(() => undefined)
    await closeFilesSearch(page).catch(() => undefined)
    return
  }
  await clickReady(del)
  await confirmDeleteDialogIfShown(page)
  await waitForFilesList(page)
  await closeFilesSearch(page).catch(() => undefined)
  await expect(
    page.getByTestId('files-folder').filter({ hasText: folderName })
  ).toHaveCount(0, { timeout: 30000 })
}

/**
 * Delete a file during test cleanup (not the scenario under test).
 * Prefer file view delete; fall back to item menu when navigation after delete
 * does not close files-view (known intermittent product issue on some stands).
 */
async function cleanupDeleteFile(page, name) {
  await closeFilesSearch(page).catch(() => undefined)

  if (!(await page.getByTestId('files-view').isVisible().catch(() => false))) {
    const listed = page.getByTestId('files-item').filter({ hasText: name }).first()
    if (!(await listed.isVisible().catch(() => false))) {
      await searchFiles(page, name)
      if (
        !(await page
          .getByTestId('files-item')
          .filter({ hasText: name })
          .first()
          .isVisible()
          .catch(() => false))
      ) {
        await closeFilesSearch(page).catch(() => undefined)
        return
      }
    }
    await openFileByName(page, name)
  }

  await clickReady(page.getByTestId('files-view-delete'))
  await confirmDeleteDialogIfShown(page)

  const viewHidden = await page
    .getByTestId('files-view')
    .waitFor({ state: 'hidden', timeout: 30000 })
    .then(() => true)
    .catch(() => false)

  if (!viewHidden) {
    console.log('  → files-view still open after delete; cleanup via list menu')
    await clickReady(page.getByTestId('files-view-back'))
    await waitForFilesList(page)
    const row = await locateByName(page, name, 'files-item', {
      timeout: 15000,
    }).catch(() => null)
    if (!row) {
      await closeFilesSearch(page).catch(() => undefined)
      return
    }
    await clickReady(row.getByTestId('files-item-more'))
    await expect(page.getByTestId('files-item-menu')).toBeVisible({
      timeout: 15000,
    })
    await clickReady(page.getByTestId('files-item-menu-delete'))
    await confirmDeleteDialogIfShown(page)
  }

  await waitForFilesList(page)
  await closeFilesSearch(page).catch(() => undefined)
}

/**
 * Best-effort cleanup of names created by this test. Never throws — failures
 * are logged so the original test error stays primary.
 */
async function cleanupArtifacts(page, { files = [], folders = [] } = {}) {
  try {
    await page.keyboard.press('Escape').catch(() => undefined)
    if (await page.getByTestId('files-view').isVisible().catch(() => false)) {
      await clickReady(page.getByTestId('files-view-back')).catch(() => undefined)
    }
    await navigateToStorageRoot(page)
  } catch (e) {
    console.log(`  → cleanupArtifacts navigate: ${e.message}`)
  }

  for (const name of files) {
    try {
      await cleanupDeleteFile(page, name)
      console.log(`  → cleanup file: ${name}`)
    } catch (e) {
      console.log(`  → cleanup file failed (${name}): ${e.message}`)
    }
  }
  for (const name of folders) {
    try {
      await deleteFolderIfPresent(page, name)
      console.log(`  → cleanup folder: ${name}`)
    } catch (e) {
      console.log(`  → cleanup folder failed (${name}): ${e.message}`)
    }
  }
}

/**
 * Remove leftover e2e / E2E artifacts from Personal so the list does not grow
 * across runs. Caps deletions per call to keep suite time bounded.
 */
async function purgeE2eLeftovers(page, { maxItems = 8 } = {}) {
  await navigateToStorageRoot(page)
  let removed = 0

  while (removed < maxItems) {
    await searchFiles(page, 'e2e')
    const file = page
      .getByTestId('files-item')
      .filter({ hasText: /e2e/i })
      .first()
    const folder = page
      .getByTestId('files-folder')
      .filter({ hasText: /e2e/i })
      .first()

    const hasFile = await file.isVisible().catch(() => false)
    const hasFolder = await folder.isVisible().catch(() => false)
    if (!hasFile && !hasFolder) {
      break
    }

    try {
      if (hasFile) {
        const label = (
          await file.locator('.file__name').innerText().catch(() => '')
        ).trim()
        await closeFilesSearch(page)
        await cleanupDeleteFile(page, label || 'e2e')
      } else {
        const label = (
          await folder.locator('.folder__name').innerText().catch(() => '')
        ).trim()
        await closeFilesSearch(page)
        await deleteFolderIfPresent(page, label || 'E2E')
      }
      removed += 1
    } catch (e) {
      console.log(`  → purgeE2eLeftovers stop: ${e.message}`)
      break
    }
  }

  await closeFilesSearch(page).catch(() => undefined)
  if (removed > 0) {
    console.log(`  → Purged ${removed} leftover e2e artifact(s)`)
  }
}

async function openPersonalStorage(page, { purge = false } = {}) {
  await navigateToStorageRoot(page)
  await clickReady(page.getByTestId('files-folder-menu'))
  await expect(page.getByTestId('mail-drawer')).toBeVisible({ timeout: 15000 })
  const personal = page
    .locator(
      '[data-test-id="files-storage-item"][data-storage-type="personal"]'
    )
    .first()
  if ((await personal.count()) > 0) {
    await clickDrawerItem(page, personal)
  } else {
    await clickDrawerItem(page, page.getByTestId('files-storage-item').first())
  }
  await waitForFilesList(page)
  if (purge) {
    await purgeE2eLeftovers(page)
  }
}

async function openSharedStorage(page) {
  await navigateToStorageRoot(page)
  await clickReady(page.getByTestId('files-folder-menu'))
  await expect(page.getByTestId('mail-drawer')).toBeVisible({ timeout: 15000 })
  const shared = page
    .locator(
      '[data-test-id="files-storage-item"][data-storage-type="shared"]'
    )
    .first()
  await expect(shared).toBeVisible({ timeout: 15000 })
  await clickDrawerItem(page, shared)
  await waitForFilesList(page)
}

/**
 * From open file view: Share with teammates → pick contact → access → Save.
 * Contact must be in the owner's team address book (q-select filter).
 */
async function shareOpenedFileWithTeammate(page, teammateEmail) {
  await clickReady(page.getByTestId('files-view-more'))
  const shareMenu = page.getByTestId('files-menu-share')
  await expect(shareMenu).toBeVisible({ timeout: 15000 })
  await clickReady(shareMenu)

  const dialog = page.getByTestId('files-share-dialog')
  await expect(dialog).toBeVisible({ timeout: 15000 })

  const selectRoot = dialog.getByTestId('files-share-contact-select')
  const input = selectRoot.locator('input').first()
  await expect(input).toBeVisible({ timeout: 10000 })
  // Quasar use-input: native input has no-pointer-events; open via field, type with force.
  await selectRoot.locator('.q-field__control').click({ force: true })
  await input.fill(teammateEmail, { force: true })
  await page.waitForTimeout(300)

  // Quasar options render in a portal outside the dialog.
  const option = page
    .locator('.q-menu .q-item, .q-virtual-scroll__content .q-item')
    .filter({ hasText: teammateEmail })
    .first()
  const optionVisible = await option
    .waitFor({ state: 'visible', timeout: 30000 })
    .then(() => true)
    .catch(() => false)
  if (!optionVisible) {
    throw new Error(
      `Teammate "${teammateEmail}" not in share autocomplete — add them to ${process.env.E2E_LOGIN || 'primary user'} team address book on the stand`
    )
  }
  await option.click()

  const plusBtn = dialog.locator('.dropdown-plus .q-btn').first()
  await expect(plusBtn).toBeEnabled({ timeout: 10000 })
  await clickReady(plusBtn)
  // Status labels in DropdownContactStatus are English keys (not i18n).
  const readStatus = page
    .locator('.q-menu .q-item')
    .filter({ hasText: /^read$/i })
    .first()
  await expect(readStatus).toBeVisible({ timeout: 10000 })
  await clickReady(readStatus)

  await expect(
    dialog.locator('.users-list').getByText(teammateEmail, { exact: false })
  ).toBeVisible({ timeout: 10000 })

  const save = page.getByTestId('files-share-save')
  await expect(save).toBeEnabled({ timeout: 10000 })
  await clickReady(save)
  await expect(dialog).toBeHidden({ timeout: 60000 })
}

module.exports = {
  listReadyOptions,
  uniqueFileName,
  uniqueFolderName,
  openFiles,
  waitForFilesList,
  searchFiles,
  closeFilesSearch,
  locateByName,
  uploadFileViaFab,
  openFileByName,
  deleteOpenedFile,
  cleanupDeleteFile,
  cleanupArtifacts,
  purgeE2eLeftovers,
  createFolderViaFab,
  deleteFolderIfPresent,
  longPressFilesItem,
  navigateToStorageRoot,
  clickDrawerItem,
  openPersonalStorage,
  openSharedStorage,
  shareOpenedFileWithTeammate,
  waitForListReady,
  clickReady,
  step,
  attachScreenshot,
}

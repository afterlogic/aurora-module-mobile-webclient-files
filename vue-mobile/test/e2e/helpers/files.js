const path = require('path')
const { sharedHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const fs = require('fs')
const { expect } = require('@playwright/test')
const { step, attachScreenshot } = sharedHelper('login')
const { waitForListReady, clickReady } = sharedHelper('ready')

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

async function uploadFileViaFab(page, uniqueName, fixturePath = defaultFixturePath) {
  await clickReady(page.getByTestId('files-create-fab'))
  await expect(page.getByTestId('files-upload-file')).toBeVisible({
    timeout: 15000,
  })

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByTestId('files-upload-file').click(),
  ])
  await fileChooser.setFiles({
    name: uniqueName,
    mimeType: 'text/plain',
    buffer: fs.readFileSync(fixturePath),
  })

  const item = page
    .getByTestId('files-item')
    .filter({ hasText: uniqueName })
    .first()
  await expect(item).toBeVisible({ timeout: 90000 })
  return item
}

async function openFileByName(page, name) {
  const item = page.getByTestId('files-item').filter({ hasText: name }).first()
  await expect(item).toBeVisible({ timeout: 30000 })
  await clickReady(item)
  await expect(page.getByTestId('files-view')).toBeVisible({ timeout: 30000 })
}

async function deleteOpenedFile(page, name) {
  await expect(page.getByTestId('files-view-delete')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('files-view-delete'))

  // Confirm only when the dialog is shown (Trash / AllowTrash=false).
  const deleteDialog = page.getByTestId('files-delete-dialog')
  const dialogShown = await deleteDialog
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false)
  if (dialogShown) {
    await clickReady(page.getByTestId('files-delete-confirm'))
    await expect(deleteDialog).toBeHidden({ timeout: 45000 })
  }

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
  for (let i = 0; i < 10; i++) {
    const back = page.getByTestId('files-path-back')
    if (!(await back.isVisible().catch(() => false))) break
    await clickReady(back)
    await waitForFilesList(page)
  }
}

/**
 * Click an item inside the left drawer (q-scroll-area).
 * Plain clickReady fails: Quasar keeps closed-drawer nodes in the DOM, so
 * Playwright can resolve Corporate while it is off-screen / not actionable,
 * then retries close the overlay. Scroll the nested container and force-click
 * only after the item is in the viewport.
 */
async function clickDrawerItem(page, item) {
  const drawer = page.getByTestId('mail-drawer')
  await expect(drawer).toBeVisible({ timeout: 15000 })

  await expect
    .poll(
      async () => {
        await item.evaluate((el) => {
          const area = el.closest('.q-scrollarea')
          const container =
            area?.querySelector('.q-scrollarea__container') ||
            el.closest('.q-scrollarea__container') ||
            el.closest('.scroll')
          if (container) {
            const er = el.getBoundingClientRect()
            const cr = container.getBoundingClientRect()
            container.scrollTop +=
              er.top - cr.top - cr.height / 2 + er.height / 2
          } else {
            el.scrollIntoView({ block: 'center', inline: 'nearest' })
          }
        })
        return item.isVisible()
      },
      { timeout: 15000, intervals: [100, 200, 400] }
    )
    .toBeTruthy()

  await expect(item).toBeInViewport({ timeout: 10000 })
  // Nested scroll + overlay: actionability click often flakes; force is safe
  // after we proved the item is on-screen inside the open drawer.
  await item.click({ force: true })
}

async function openPersonalStorage(page) {
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

  // Quasar options render in a portal outside the dialog.
  const option = page
    .locator('.q-menu .q-item, .q-virtual-scroll__content .q-item')
    .filter({ hasText: teammateEmail })
    .first()
  await expect(option).toBeVisible({ timeout: 30000 })
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
  openFiles,
  waitForFilesList,
  uploadFileViaFab,
  openFileByName,
  deleteOpenedFile,
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

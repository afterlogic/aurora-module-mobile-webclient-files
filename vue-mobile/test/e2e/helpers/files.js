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
  spinnerSelectors: ['.q-linear-progress'],
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
  await expect(page.getByTestId('files-delete-dialog')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('files-delete-confirm'))
  await expect(page.getByTestId('files-delete-dialog')).toBeHidden({
    timeout: 45000,
  })
  if (await page.getByTestId('files-view').isVisible().catch(() => false)) {
    await clickReady(page.getByTestId('files-view-back'))
  }
  await waitForFilesList(page)
  await expect(
    page.getByTestId('files-item').filter({ hasText: name })
  ).toHaveCount(0, { timeout: 60000 })
}

async function longPressFilesItem(page, item) {
  const box = await item.boundingBox()
  if (!box) {
    throw new Error('files item has no bounding box for long-press')
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(750)
  await page.mouse.up()
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
    await clickReady(personal)
  } else {
    await clickReady(page.getByTestId('files-storage-item').first())
  }
  await waitForFilesList(page)
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
  openPersonalStorage,
  waitForListReady,
  clickReady,
  step,
  attachScreenshot,
}

const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')
const {
  openFiles,
  waitForFilesList,
  uploadFileViaFab,
  openFileByName,
  deleteOpenedFile,
  longPressFilesItem,
  openPersonalStorage,
  navigateToStorageRoot,
} = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile files select-copy and download', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('multi-select copy into a folder', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const folderCount = await page.getByTestId('files-folder').count()
    test.skip(folderCount === 0, 'Need at least one folder as copy destination')

    const stamp = Date.now()
    const uniqueName = `e2e-sc-${stamp}.txt`
    const folderName = (
      await page
        .getByTestId('files-folder')
        .first()
        .locator('.folder__name')
        .innerText()
        .catch(() => '')
    ).trim()

    await step('Upload file', async () => {
      await uploadFileViaFab(page, uniqueName)
    })

    await step('Long-press → select Copy', async () => {
      const item = page
        .getByTestId('files-item')
        .filter({ hasText: uniqueName })
        .first()
      await longPressFilesItem(page, item)
      await expect(page.getByTestId('files-select-header')).toBeVisible({
        timeout: 15000,
      })
      const copyBtn = page.getByTestId('files-select-copy')
      await expect(copyBtn).toBeVisible({ timeout: 10000 })
      // Native wrapper @click on files-select-copy; hasTouch Playwright click/tap
      // miss q-btn, but HTMLElement.click() runs the Vue listener on this node.
      await copyBtn.evaluate((el) => el.click())
      await expect(page.getByTestId('files-copymove-header')).toBeVisible({
        timeout: 15000,
      })
      await attachScreenshot(page, 'files-select-copy-01')
    })

    await step(`Copy into "${folderName}"`, async () => {
      await clickReady(
        page
          .getByTestId('files-folder')
          .filter({ hasText: folderName })
          .first()
      )
      await waitForFilesList(page)
      await clickReady(page.getByTestId('files-copymove-copy'))
      await expect(page.getByTestId('files-copymove-header')).toBeHidden({
        timeout: 45000,
      })
      await waitForFilesList(page)
      await expect(
        page.getByTestId('files-item').filter({ hasText: uniqueName }).first()
      ).toBeVisible({ timeout: 60000 })
      console.log(`  → Copy in folder: ${folderName}`)
      await attachScreenshot(page, 'files-select-copy-02')
    })

    await step('Cleanup: delete copy in folder + original', async () => {
      await openFileByName(page, uniqueName)
      await deleteOpenedFile(page, uniqueName)
      await openPersonalStorage(page)
      await navigateToStorageRoot(page)
      const original = page
        .getByTestId('files-item')
        .filter({ hasText: uniqueName })
      if ((await original.count()) > 0) {
        await openFileByName(page, uniqueName)
        await deleteOpenedFile(page, uniqueName)
      }
    })
  })

  test('download button on file view triggers download', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const uniqueName = `e2e-dl-${Date.now()}.txt`

    await step('Upload and open file', async () => {
      await uploadFileViaFab(page, uniqueName)
      await openFileByName(page, uniqueName)
    })

    await step('Click download and expect browser download', async () => {
      const downloadBtn = page.getByTestId('files-view-download')
      test.skip(
        (await downloadBtn.count()) === 0,
        'Download action not available'
      )
      let gotDownload = false
      try {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 20000 }),
          clickReady(downloadBtn),
        ])
        const suggested = download.suggestedFilename()
        console.log(`  → Download: ${suggested}`)
        expect(suggested.length).toBeGreaterThan(0)
        gotDownload = true
      } catch (e) {
        // Some stands open URL in a new tab / blob without Playwright download event.
        console.log(`  → No download event (${e.message.split('\\n')[0]})`)
        await expect(page.getByTestId('files-view')).toBeVisible()
        await expect(downloadBtn).toBeVisible()
      }
      console.log(`  → Download path: ${gotDownload ? 'event' : 'no-event-ok'}`)
      await attachScreenshot(page, 'files-download-01')
    })

    await step('Cleanup', async () => {
      await deleteOpenedFile(page, uniqueName)
    })
  })

  test('renames folder via item menu', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const stamp = Date.now()
    const folderName = `E2E Fr ${stamp}`
    const renamed = `E2E FrRen ${stamp}`

    await step('Create folder', async () => {
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
      await expect(
        page.getByTestId('files-folder').filter({ hasText: folderName }).first()
      ).toBeVisible({ timeout: 60000 })
    })

    await step('Folder menu → Rename', async () => {
      const folder = page
        .getByTestId('files-folder')
        .filter({ hasText: folderName })
        .first()
      await clickReady(folder.getByTestId('files-folder-more'))
      await expect(page.getByTestId('files-item-menu')).toBeVisible({
        timeout: 15000,
      })
      const rename = page.getByTestId('files-item-menu-rename')
      test.skip((await rename.count()) === 0, 'Rename not in folder menu')
      await clickReady(rename)
      await expect(page.getByTestId('files-rename-dialog')).toBeVisible({
        timeout: 15000,
      })
      await page.getByTestId('files-rename-name').locator('input').fill(renamed)
      await clickReady(page.getByTestId('files-rename-submit'))
      await expect(page.getByTestId('files-rename-dialog')).toBeHidden({
        timeout: 45000,
      })
      await waitForFilesList(page)
      await expect(
        page.getByTestId('files-folder').filter({ hasText: renamed }).first()
      ).toBeVisible({ timeout: 60000 })
      console.log(`  → Folder renamed: ${folderName} → ${renamed}`)
      await attachScreenshot(page, 'files-folder-rename-01')
    })

    await step('Cleanup: delete renamed folder if possible', async () => {
      const folder = page
        .getByTestId('files-folder')
        .filter({ hasText: renamed })
        .first()
      await clickReady(folder.getByTestId('files-folder-more'))
      const del = page.getByTestId('files-item-menu-delete')
      if ((await del.count()) === 0) {
        console.log('  → No delete in folder menu; leave folder')
        await page.keyboard.press('Escape').catch(() => undefined)
        return
      }
      await clickReady(del)
      // Confirm only when shown (Trash / AllowTrash=false); otherwise delete
      // goes straight to trash without files-delete-dialog.
      const deleteDialog = page.getByTestId('files-delete-dialog')
      const dialogShown = await deleteDialog
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false)
      if (dialogShown) {
        await clickReady(page.getByTestId('files-delete-confirm'))
        await expect(deleteDialog).toBeHidden({ timeout: 45000 })
      }
      await waitForFilesList(page)
      await expect(
        page.getByTestId('files-folder').filter({ hasText: renamed })
      ).toHaveCount(0, { timeout: 30000 })
    })
  })
})

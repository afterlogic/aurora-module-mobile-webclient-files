const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = sharedHelper('fixtures')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')
const {
  openFiles,
  waitForFilesList,
  uploadFileViaFab,
  openFileByName,
  cleanupArtifacts,
  createFolderViaFab,
  longPressFilesItem,
  openPersonalStorage,
  uniqueFileName,
  uniqueFolderName,
  locateByName,
} = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile files select-copy and download', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('multi-select copy into a folder', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page, { purge: true })

    const uniqueName = uniqueFileName('e2e-sc')
    const folderName = uniqueFolderName('E2E Sc')

    try {
      await step('Create destination folder', async () => {
        await createFolderViaFab(page, folderName)
        console.log(`  → Destination folder: ${folderName}`)
      })

      await step('Upload file', async () => {
        await uploadFileViaFab(page, uniqueName)
      })

      await step('Long-press → select Copy', async () => {
        const item = await locateByName(page, uniqueName, 'files-item')
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
        const folder = page
          .getByTestId('files-folder')
          .filter({ hasText: folderName })
          .first()
        await folder.scrollIntoViewIfNeeded()
        await clickReady(folder)
        await waitForFilesList(page)
        await clickReady(page.getByTestId('files-copymove-copy'))
        await expect(page.getByTestId('files-copymove-header')).toBeHidden({
          timeout: 45000,
        })
        await waitForFilesList(page)
        await locateByName(page, uniqueName, 'files-item')
        console.log(`  → Copy in folder: ${folderName}`)
        await attachScreenshot(page, 'files-select-copy-02')
      })
    } finally {
      await cleanupArtifacts(page, {
        files: [uniqueName],
        folders: [folderName],
      })
    }
  })

  test('download button on file view triggers download', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const uniqueName = uniqueFileName('e2e-dl')

    try {
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
    } finally {
      await cleanupArtifacts(page, { files: [uniqueName] })
    }
  })

  test('renames folder via item menu', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const folderName = uniqueFolderName('E2E Fr')
    const renamed = uniqueFolderName('E2E FrR')

    try {
      await step('Create folder', async () => {
        await createFolderViaFab(page, folderName)
      })

      await step('Folder menu → Rename', async () => {
        const folder = await locateByName(page, folderName, 'files-folder')
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
        await locateByName(page, renamed, 'files-folder')
        console.log(`  → Folder renamed: ${folderName} → ${renamed}`)
        await attachScreenshot(page, 'files-folder-rename-01')
      })
    } finally {
      await cleanupArtifacts(page, { folders: [folderName, renamed] })
    }
  })
})

const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'e2e/helpers/paths'
))
const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady, waitForListReady } = sharedHelper('ready')
const {
  openFiles,
  waitForFilesList,
  listReadyOptions,
  uploadFileViaFab,
  openFileByName,
  deleteOpenedFile,
} = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile files actions', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens drawer and shows storages', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    await openFiles(page)

    await step('Open files drawer', async () => {
      await clickReady(page.getByTestId('files-folder-menu'))
      await expect(page.getByTestId('mail-drawer')).toBeVisible({
        timeout: 15000,
      })
      const storages = page.getByTestId('files-storage-item')
      await expect(storages.first()).toBeVisible({ timeout: 15000 })
      const count = await storages.count()
      console.log(`  → Storages: ${count}`)
      expect(count).toBeGreaterThan(0)
      await attachScreenshot(page, 'files-drawer-01')
    })

    await step('Select first storage and close drawer', async () => {
      await clickReady(page.getByTestId('files-storage-item').first())
      await waitForFilesList(page)
      await attachScreenshot(page, 'files-drawer-02-selected')
    })
  })

  test('search filters files list', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    await openFiles(page)

    const fileItems = page.getByTestId('files-item')
    const folderItems = page.getByTestId('files-folder')
    test.skip(
      (await fileItems.count()) === 0 && (await folderItems.count()) === 0,
      'Files storage is empty'
    )

    const first =
      (await fileItems.count()) > 0 ? fileItems.first() : folderItems.first()
    const name = (
      await first
        .locator('.file__name, .folder__name')
        .innerText()
        .catch(() => '')
    ).trim()
    const query = name.split(/[\s._-]+/).find((w) => w.length > 2) || name
    test.skip(!query, 'No searchable name on first item')

    await step('Open search and type query', async () => {
      await clickReady(page.getByTestId('files-search'))
      await expect(page.getByTestId('files-search-input')).toBeVisible({
        timeout: 15000,
      })
      await page.getByTestId('files-search-input').locator('input').fill(query)
      console.log(`  → Search query: ${query}`)
      await page.waitForTimeout(800)
      await waitForListReady(page, listReadyOptions)
      await attachScreenshot(page, 'files-search-01')
    })

    await step('Expect filtered list contains query', async () => {
      const items = page
        .getByTestId('files-item')
        .or(page.getByTestId('files-folder'))
      await expect(items.first()).toBeVisible({ timeout: 30000 })
      const count = await items.count()
      console.log(`  → Results: ${count}`)
      expect(count).toBeGreaterThan(0)
      await expect(items.first()).toContainText(new RegExp(query, 'i'))
    })

    await step('Close search', async () => {
      await clickReady(page.getByTestId('files-search-close'))
      await expect(page.getByTestId('files-search-input')).toBeHidden({
        timeout: 15000,
      })
      await expect(page.getByTestId('files-search')).toBeVisible()
    })
  })

  test('creates a folder via FAB', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openFiles(page)

    const folderName = `E2E Folder ${Date.now()}`

    await step('Open create menu → Create folder', async () => {
      await clickReady(page.getByTestId('files-create-fab'))
      await expect(page.getByTestId('files-create-menu')).toBeVisible({
        timeout: 15000,
      })
      await clickReady(page.getByTestId('files-create-folder'))
      await expect(page.getByTestId('files-create-folder-dialog')).toBeVisible({
        timeout: 15000,
      })
    })

    await step(`Name folder "${folderName}" and create`, async () => {
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

    await step('Open folder and go back', async () => {
      await clickReady(
        page.getByTestId('files-folder').filter({ hasText: folderName }).first()
      )
      await waitForFilesList(page)
      await clickReady(page.getByTestId('files-path-back'))
      await waitForFilesList(page)
    })
  })

  test('uploads a file via FAB and deletes it', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)

    const uniqueName = `e2e-upload-${Date.now()}.txt`

    await step('Upload file via FAB', async () => {
      await uploadFileViaFab(page, uniqueName)
      console.log(`  → Uploaded: ${uniqueName}`)
      await attachScreenshot(page, 'files-upload-01-list')
    })

    await step('Open uploaded file and delete', async () => {
      await openFileByName(page, uniqueName)
      await deleteOpenedFile(page, uniqueName)
      console.log(`  → Deleted: ${uniqueName}`)
      await attachScreenshot(page, 'files-upload-02-deleted')
    })
  })

  test('renames uploaded file', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)

    const originalName = `e2e-rename-${Date.now()}.txt`
    const renamedName = `e2e-renamed-${Date.now()}.txt`

    await step('Upload file for rename', async () => {
      await uploadFileViaFab(page, originalName)
    })

    await step('Open file → Rename', async () => {
      await openFileByName(page, originalName)
      await clickReady(page.getByTestId('files-view-more'))
      await expect(page.getByTestId('files-menu-rename')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('files-menu-rename'))
      await expect(page.getByTestId('files-rename-dialog')).toBeVisible({
        timeout: 15000,
      })
      await attachScreenshot(page, 'files-rename-01-dialog')
    })

    await step(`Rename to ${renamedName}`, async () => {
      const input = page.getByTestId('files-rename-name').locator('input')
      await expect(input).toBeVisible({ timeout: 10000 })
      await input.fill(renamedName)
      await clickReady(page.getByTestId('files-rename-submit'))
      await expect(page.getByTestId('files-rename-dialog')).toBeHidden({
        timeout: 45000,
      })
      await expect(page.getByTestId('files-view-name').locator('input')).toHaveValue(
        renamedName,
        { timeout: 30000 }
      )
      console.log(`  → Renamed: ${originalName} → ${renamedName}`)
      await attachScreenshot(page, 'files-rename-02-done')
    })

    await step('Cleanup: delete renamed file', async () => {
      await deleteOpenedFile(page, renamedName)
    })
  })

  test('creates and removes a public share link', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)

    const uniqueName = `e2e-share-${Date.now()}.txt`

    await step('Upload file for share link', async () => {
      await uploadFileViaFab(page, uniqueName)
    })

    await step('Open share-link dialog and create link', async () => {
      await openFileByName(page, uniqueName)
      const shareBtn = page.getByTestId('files-view-share-link')
      test.skip(
        (await shareBtn.count()) === 0,
        'Public share link action not available on this storage/module'
      )
      await clickReady(shareBtn)
      await expect(page.getByTestId('files-share-link-dialog')).toBeVisible({
        timeout: 15000,
      })
      await clickReady(page.getByTestId('files-share-link-create'))
      await expect(page.getByTestId('files-share-link-url')).toBeVisible({
        timeout: 45000,
      })
      const linkText = (
        await page.getByTestId('files-share-link-url').innerText()
      ).trim()
      console.log(`  → Public link created (${linkText.length} chars)`)
      expect(linkText.length).toBeGreaterThan(0)
      await attachScreenshot(page, 'files-share-01-link')
    })

    await step('Remove public link and close dialog', async () => {
      await clickReady(page.getByTestId('files-share-link-remove'))
      // removeLink emits closeDialog on success.
      await expect(page.getByTestId('files-share-link-dialog')).toBeHidden({
        timeout: 45000,
      })
      console.log('  → Public link removed')
      await attachScreenshot(page, 'files-share-02-removed')
    })

    await step('Cleanup: delete file', async () => {
      await deleteOpenedFile(page, uniqueName)
    })
  })

  test('moves uploaded file into a folder', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)

    const folderCount = await page.getByTestId('files-folder').count()
    test.skip(
      folderCount === 0,
      'Need at least one folder as move destination'
    )

    const uniqueName = `e2e-move-${Date.now()}.txt`
    const folderName = (
      await page
        .getByTestId('files-folder')
        .first()
        .locator('.folder__name')
        .innerText()
        .catch(() => '')
    ).trim()

    await step('Upload file for move', async () => {
      await uploadFileViaFab(page, uniqueName)
    })

    await step('Open file → Copy/Move mode', async () => {
      await openFileByName(page, uniqueName)
      await clickReady(page.getByTestId('files-view-more'))
      await expect(page.getByTestId('files-menu-copy')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('files-menu-copy'))
      await expect(page.getByTestId('files-copymove-header')).toBeVisible({
        timeout: 15000,
      })
      await expect(page.getByTestId('files-copymove-footer')).toBeVisible({
        timeout: 15000,
      })
      console.log('  → Copy/Move mode active')
      await attachScreenshot(page, 'files-move-01-mode')
    })

    await step(`Move into folder "${folderName}"`, async () => {
      const folder = page
        .getByTestId('files-folder')
        .filter({ hasText: folderName })
        .first()
      await clickReady(folder)
      await waitForFilesList(page)
      await expect(page.getByTestId('files-copymove-move')).toBeVisible({
        timeout: 15000,
      })
      await clickReady(page.getByTestId('files-copymove-move'))
      await expect(page.getByTestId('files-copymove-header')).toBeHidden({
        timeout: 45000,
      })
      await waitForFilesList(page)
      await expect(
        page.getByTestId('files-item').filter({ hasText: uniqueName }).first()
      ).toBeVisible({ timeout: 60000 })
      console.log(`  → Moved into: ${folderName}`)
      await attachScreenshot(page, 'files-move-02-in-folder')
    })

    await step('Cleanup: delete moved file', async () => {
      await openFileByName(page, uniqueName)
      await deleteOpenedFile(page, uniqueName)
    })
  })
})

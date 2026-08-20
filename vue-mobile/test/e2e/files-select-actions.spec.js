const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = sharedHelper('fixtures')
const { loginAsTestUser, loginAsUser, step, attachScreenshot } =
  sharedHelper('login')
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
  openSharedStorage,
  shareOpenedFileWithTeammate,
  uniqueFileName,
  uniqueFolderName,
  locateByName,
} = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)
const secondaryLogin = process.env.E2E_LOGIN_SECONDARY
const secondaryPassword = process.env.E2E_PASSWORD_SECONDARY
const hasSecondary = !!(secondaryLogin && secondaryPassword)

test.describe('Mobile files copy, select, share', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('copies uploaded file into a folder (original remains)', async ({
    page,
  }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page, { purge: true })

    const uniqueName = uniqueFileName('e2e-cp')
    const folderName = uniqueFolderName('E2E Cp')

    try {
      await step('Create destination folder', async () => {
        await createFolderViaFab(page, folderName)
        console.log(`  → Destination folder: ${folderName}`)
      })

      await step('Upload file for copy', async () => {
        await uploadFileViaFab(page, uniqueName)
      })

      await step('Open file → Copy mode', async () => {
        await openFileByName(page, uniqueName)
        await clickReady(page.getByTestId('files-view-more'))
        await expect(page.getByTestId('files-menu-copy')).toBeVisible({
          timeout: 10000,
        })
        await clickReady(page.getByTestId('files-menu-copy'))
        await expect(page.getByTestId('files-copymove-header')).toBeVisible({
          timeout: 15000,
        })
        await expect(page.getByTestId('files-copymove-copy')).toBeVisible({
          timeout: 15000,
        })
        await attachScreenshot(page, 'files-copy-01-mode')
      })

      await step(`Copy into folder "${folderName}"`, async () => {
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
        console.log(`  → Copy present in folder: ${folderName}`)
        await attachScreenshot(page, 'files-copy-02-in-folder')
      })

      await step('Original still in personal root', async () => {
        await openPersonalStorage(page)
        await locateByName(page, uniqueName, 'files-item')
        console.log('  → Original still in source')
        await attachScreenshot(page, 'files-copy-03-original')
      })
    } finally {
      await cleanupArtifacts(page, {
        files: [uniqueName],
        folders: [folderName],
      })
    }
  })

  test('multi-select bulk deletes uploaded files', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const stamp = Date.now()
    const nameA = `e2e-ba-${stamp}.txt`
    const nameB = `e2e-bb-${stamp}.txt`

    try {
      await step('Upload two files', async () => {
        await uploadFileViaFab(page, nameA)
        await uploadFileViaFab(page, nameB)
      })

      await step('Long-press first → select mode, tap second', async () => {
        const itemA = await locateByName(page, nameA, 'files-item')
        await longPressFilesItem(page, itemA)
        await expect(page.getByTestId('files-select-header')).toBeVisible({
          timeout: 15000,
        })
        await expect(page.getByTestId('files-select-count')).toContainText(
          'Selected: 1',
          { timeout: 10000 }
        )
        const itemB = await locateByName(page, nameB, 'files-item')
        await expect(itemB).toBeVisible({ timeout: 15000 })
        await itemB.tap()
        await expect(page.getByTestId('files-select-count')).toContainText(
          'Selected: 2',
          { timeout: 10000 }
        )
        await attachScreenshot(page, 'files-select-01')
      })

      await step('Bulk delete → confirm', async () => {
        const deleteBtn = page.getByTestId('files-select-delete')
        await expect(deleteBtn).toBeVisible({ timeout: 10000 })
        // Native wrapper @click (same as select-copy); hasTouch clickReady can miss.
        await deleteBtn.evaluate((el) => el.click())
        const deleteDialog = page.getByTestId('files-delete-dialog')
        const dialogShown = await deleteDialog
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false)
        if (dialogShown) {
          await clickReady(page.getByTestId('files-delete-confirm'))
          await expect(deleteDialog).toBeHidden({ timeout: 60000 })
        }
        await expect(page.getByTestId('files-select-header')).toBeHidden({
          timeout: 30000,
        })
        await waitForFilesList(page)
        await expect(
          page.getByTestId('files-item').filter({ hasText: nameA })
        ).toHaveCount(0, { timeout: 30000 })
        await expect(
          page.getByTestId('files-item').filter({ hasText: nameB })
        ).toHaveCount(0, { timeout: 30000 })
        console.log('  → Both files deleted')
        await attachScreenshot(page, 'files-select-02-deleted')
      })
    } finally {
      await cleanupArtifacts(page, { files: [nameA, nameB] })
    }
  })

  test('opens Share with teammates dialog', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page)

    const uniqueName = uniqueFileName('e2e-tm')

    try {
      await step('Upload file', async () => {
        await uploadFileViaFab(page, uniqueName)
        await openFileByName(page, uniqueName)
      })

      await step('Open Share with teammates', async () => {
        await clickReady(page.getByTestId('files-view-more'))
        const shareMenu = page.getByTestId('files-menu-share')
        test.skip(
          (await shareMenu.count()) === 0,
          'Share with teammates not available (corporate storage or no rights)'
        )
        await clickReady(shareMenu)
        await expect(page.getByTestId('files-share-dialog')).toBeVisible({
          timeout: 15000,
        })
        await expect(page.getByTestId('files-share-contact-select')).toBeVisible()
        await expect(page.getByTestId('files-share-save')).toBeVisible()
        console.log('  → Share with teammates dialog open')
        await attachScreenshot(page, 'files-teammates-01')
      })

      await step('Close dialog without saving', async () => {
        const dialog = page.getByTestId('files-share-dialog')
        await page.keyboard.press('Escape').catch(() => undefined)
        if (await dialog.isVisible().catch(() => false)) {
          const closeIcon = dialog.locator('.cancel-icon')
          await expect(closeIcon).toBeVisible({ timeout: 10000 })
          await closeIcon.click({ force: true })
        }
        await expect(dialog).toBeHidden({ timeout: 30000 })
      })
    } finally {
      await cleanupArtifacts(page, { files: [uniqueName] })
    }
  })

  test('leave share action when shared item is available', async ({ page }) => {
    test.setTimeout(300000)
    test.skip(
      !hasSecondary,
      'Set E2E_LOGIN_SECONDARY and E2E_PASSWORD_SECONDARY in .env.e2e'
    )

    const uniqueName = uniqueFileName('e2e-lv')

    try {
      await step(`Owner shares file with ${secondaryLogin}`, async () => {
        await loginAsTestUser(page)
        await openFiles(page)
        await openPersonalStorage(page, { purge: true })
        await uploadFileViaFab(page, uniqueName)
        await openFileByName(page, uniqueName)
        await shareOpenedFileWithTeammate(page, secondaryLogin)
        await attachScreenshot(page, 'files-leave-00-shared-by-owner')
      })

      await step('Recipient opens Shared storage', async () => {
        await loginAsUser(page, {
          login: secondaryLogin,
          password: secondaryPassword,
        })
        await openFiles(page)
        await openSharedStorage(page)
        await locateByName(page, uniqueName, 'files-item')
        await attachScreenshot(page, 'files-leave-01-in-shared')
      })

      await step('Leave share via item menu', async () => {
        const item = await locateByName(page, uniqueName, 'files-item')
        await clickReady(item.getByTestId('files-item-more'))
        const menu = page.getByTestId('files-item-menu')
        await expect(menu).toBeVisible({ timeout: 15000 })
        await attachScreenshot(page, 'files-leave-02-menu')
        await clickReady(page.getByTestId('files-item-menu-shareLeave'))
        await expect(page.getByTestId('files-share-leave-dialog')).toBeVisible({
          timeout: 15000,
        })
        await attachScreenshot(page, 'files-leave-03-dialog')
        await clickReady(page.getByTestId('files-share-leave-confirm'))
        await expect(page.getByTestId('files-share-leave-dialog')).toBeHidden({
          timeout: 45000,
        })
        await waitForFilesList(page)
        await expect(
          page.getByTestId('files-item').filter({ hasText: uniqueName })
        ).toHaveCount(0, { timeout: 60000 })
        console.log('  → Left share; file gone from Shared')
        await attachScreenshot(page, 'files-leave-04-done')
      })
    } finally {
      try {
        await loginAsTestUser(page)
        await openFiles(page)
        await openPersonalStorage(page)
        await cleanupArtifacts(page, { files: [uniqueName] })
      } catch (e) {
        console.log(`  → leave-share owner cleanup: ${e.message}`)
      }
    }
  })
})

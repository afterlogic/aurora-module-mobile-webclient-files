const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = sharedHelper('fixtures')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')
const { openFiles, waitForFilesList } = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile files', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens first file from the list and goes back', async ({ page }) => {
    test.setTimeout(120000)

    await loginAsTestUser(page)

    await step('Open Files from footer nav', async () => {
      await openFiles(page)
      console.log('  → Files screen is open')
      await attachScreenshot(page, 'files-01-list')
    })

    const fileItems = page.getByTestId('files-item')
    const folderItems = page.getByTestId('files-folder')
    const fileCount = await fileItems.count()
    const folderCount = await folderItems.count()

    await step(
      `Inspect files list (files: ${fileCount}, folders: ${folderCount})`,
      async () => {
        if (fileCount === 0 && folderCount === 0) {
          console.log('  → Storage/folder is empty')
          await attachScreenshot(page, 'files-02-empty')
          return
        }

        if (fileCount > 0) {
          const name = (
            await fileItems
              .first()
              .locator('.file__name')
              .innerText()
              .catch(() => '')
          ).trim()
          console.log(`  → First file: ${name || '(unnamed)'}`)
        } else {
          const name = (
            await folderItems
              .first()
              .locator('.folder__name')
              .innerText()
              .catch(() => '')
          ).trim()
          console.log(`  → No files; first folder: ${name || '(unnamed)'}`)
        }
        await attachScreenshot(page, 'files-02-list')
      }
    )

    test.skip(
      fileCount === 0 && folderCount === 0,
      'Files storage is empty — add a file or folder for this smoke'
    )

    if (fileCount > 0) {
      await step('Open first file', async () => {
        await clickReady(fileItems.first())
        console.log('  → Clicked first files-item')
      })

      await step('Wait for file info card', async () => {
        await expect(page.getByTestId('files-view')).toBeVisible({
          timeout: 30000,
        })
        await expect(page.getByTestId('files-view-name')).toBeVisible({
          timeout: 15000,
        })
        const name = await page
          .getByTestId('files-view-name')
          .locator('input')
          .inputValue()
          .catch(async () =>
            (await page.getByTestId('files-view-name').innerText()).trim()
          )
        console.log(`  → Opened file card: ${name}`)
        await attachScreenshot(page, 'files-03-view')
      })

      await step('Go back to files list', async () => {
        await clickReady(page.getByTestId('files-view-back'))
        await expect(page.getByTestId('files-view')).not.toBeVisible({
          timeout: 15000,
        })
        await waitForFilesList(page)
        await expect(page.getByTestId('files-item').first()).toBeVisible({
          timeout: 15000,
        })
        console.log('  → Back on files list')
        await attachScreenshot(page, 'files-04-back')
      })
    } else {
      await step('Open first folder (no files in root)', async () => {
        const name = (
          await folderItems
            .first()
            .locator('.folder__name')
            .innerText()
            .catch(() => '')
        ).trim()
        await clickReady(folderItems.first())
        console.log(`  → Opened folder: ${name || '(unnamed)'}`)
        await waitForFilesList(page)
        await attachScreenshot(page, 'files-03-folder')
      })
    }
  })
})

const path = require('path')
const { sharedHelper } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = sharedHelper('fixtures')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')
const {
  openFiles,
  openPersonalStorage,
  isCreateShortcutAvailable,
  uniqueShortcutUrl,
  installApiJsonSanitizeRoute,
  uninstallApiJsonSanitizeRoute,
  createShortcutViaFab,
  deleteShortcutViaMenu,
  waitForFilesList,
} = require('./helpers/files')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile files shortcuts', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('creates a shortcut via FAB, opens it, and deletes it', async ({ page }) => {
    test.setTimeout(300000)
    await loginAsTestUser(page)
    await openFiles(page)
    await openPersonalStorage(page, { purge: true })

    const available = await isCreateShortcutAvailable(page)
    test.skip(
      !available,
      'Create shortcut FAB entry missing — rebuild static/vue-mobile (npm run build-production) or DisableShortcuts / unsupported storage'
    )

    const url = uniqueShortcutUrl()
    const urlToken = (url.match(/e2e-sc-\d+/) || [''])[0]
    console.log(`  → Shortcut target URL: ${url}`)
    let shortcutName = ''

    await installApiJsonSanitizeRoute(page)
    try {
      await step('Create shortcut from external URL', async () => {
        const created = await createShortcutViaFab(page, url)
        shortcutName = created.name
        console.log(`  → Shortcut: ${shortcutName} → ${url}`)
        await expect(created.item).toBeVisible({ timeout: 15000 })
        await expect(created.item.locator('.file__info-icon_link')).toBeVisible({
          timeout: 10000,
        })
        await attachScreenshot(page, 'files-shortcut-01-created')
      })

      await step('Tap shortcut opens external URL', async () => {
        const row = page
          .getByTestId('files-item')
          .filter({ hasText: shortcutName })
          .first()
        await expect(row).toBeVisible({ timeout: 15000 })

        const popupPromise = page.waitForEvent('popup', { timeout: 30000 })
        await clickReady(row)
        const popup = await popupPromise
        await expect(popup).toHaveURL(new RegExp(urlToken || 'e2e-sc-'), {
          timeout: 30000,
        })
        await popup.close()
        await waitForFilesList(page)
        await attachScreenshot(page, 'files-shortcut-02-opened')
      })

      await step('Delete shortcut via item menu', async () => {
        await deleteShortcutViaMenu(page, shortcutName)
        await attachScreenshot(page, 'files-shortcut-03-deleted')
      })
    } finally {
      await uninstallApiJsonSanitizeRoute(page)
      if (shortcutName) {
        const leftover = page
          .getByTestId('files-item')
          .filter({ hasText: shortcutName })
        if ((await leftover.count().catch(() => 0)) > 0) {
          await deleteShortcutViaMenu(page, shortcutName).catch((e) => {
            console.log(`  → cleanup shortcut failed: ${e.message}`)
          })
        }
      }
    }
  })
})

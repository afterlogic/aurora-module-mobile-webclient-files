# Mobile E2E (Playwright)

Scenarios for **FilesMobileWebclient**.

Full docs (run / UI Mode / filters / env):

- Install root: [`README-e2e-mobile.md`](../../../../../README-e2e-mobile.md)
- Runner: [`CoreMobileWebclient/vue-mobile/test/e2e/README.md`](../../../../CoreMobileWebclient/vue-mobile/test/e2e/README.md)

```bash
# from Aurora install root
npm run test:e2e-mobile -- --setup "FilesMobileWebclient iPhone13"
npm run test:e2e-mobile:ui -- --setup "FilesMobileWebclient iPhone13"

# from modules/CoreMobileWebclient/vue-mobile
npm run test:e2e -- --setup "FilesMobileWebclient iPhone13"
npm run test:e2e:ui -- --setup "FilesMobileWebclient iPhone13"
```

`--setup "<modules> <devices>"` (like desktop). Comma-separate multiple modules/devices.
`*` = all modules: `--setup "* iPhone13"`. Device aliases: `"iPhone 13"` → `iPhone13`.

Shared helpers: Core `test/e2e/helpers/` (`AURORA_MOBILE_E2E_ROOT`). Domain helpers: `./helpers/` here.

| File | What it covers |
|------|----------------|
| `files.spec.js` | Open first file / folder |
| `files-actions.spec.js` | Drawer, storages, search, FAB folder/upload, rename, public link, move |
| `files-shortcut.spec.js` | FAB → Create shortcut, open external URL, delete via menu |
| `files-extra-actions.spec.js` | Extra file actions |
| `files-select-actions.spec.js` | Multi-select actions |



import settings from './settings'

export default {
  moduleName: 'FilesMobileWebclient',

  requiredModules: [],

  init (appdata) {
    settings.init(appdata)
  },
}

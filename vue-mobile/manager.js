import settings from './settings'

export default {
  moduleName: 'FilesMobileWebclient',

  requiredModules: [],

  init (appdata) {
    settings.init(appdata)
  },

  getNormalUserPages () {
    return [
      {
        pageName: 'files',
        pagePath: '/files',
        pageComponent: () => import('./pages/Files')
      },
      {
        pageName: 'file',
        pagePath: '/file/:id',
        pageComponent: () => import('./pages/FileInfo'),
      },
    ]
  },
}

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
        pageComponent: () => import('./pages/Files'),
        pageHeaderComponent: () => import('./components/header/FilesHeader'),
      },
      {
        pageName: 'file',
        pagePath: '/file/:id',
        pageComponent: () => import('./pages/FileInfo'),
        pageHeaderComponent: () => import('./components/header/FileInfoHeader'),
      },
    ]
  },
}

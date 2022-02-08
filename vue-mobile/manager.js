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
        pageFooterComponent: () => import('./components/footer/FilesFooter'),
      },
      {
        pageName: 'file',
        pagePath: '/file/:id',
        pageComponent: () => import('./pages/FileInfo'),
        pageHeaderComponent: () => import('./components/header/FileInfoHeader'),
        pageFooterComponent: () => import('./components/footer/FilesFooter'),
      },
    ]
  },

  getPageFooterButtons () {
    return [
      {
        pageName: 'files',
        pagePath: '/files',
        highlightPaths: ['/files', '/file'],
        getIconComponent: () => import('./components/icons/FilesFooterIcon'),
      },
    ]
  },
}

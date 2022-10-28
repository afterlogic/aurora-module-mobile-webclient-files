import settings from './settings'
import { defineAsyncComponent } from 'vue'

export default {
  moduleName: 'FilesMobileWebclient',

  requiredModules: [],

  init(appdata) {
    settings.init(appdata)
  },

  getNormalUserPages() {
    return [
      {
        pageName: 'files',
        pagePath: '/files',
        pageComponent: () => import('./pages/Files'),
        pageStrict: true,
        pageFooterComponent: () => import('./components/footer/FilesFooter'),

        pageChildren: [
          {
            name: 'file-list',
            path: ':storageId/:path*/',
            strict: true,
            component: () => import('./pages/FileList'),
          },
          {
            name: 'file-view',
            path: ':storageId/:path*/:fileName',
            component: () => import('./pages/FileInfo'),
            strict: true,
          },
        ],
      },
      // {
      //   pageName: 'file-list',
      //   pagePath: '/files/:path*/',
      //   pageComponent: () => import('./pages/FileList'),
      //   pageStrict: true,
      //   pageFooterComponent: () => import('./components/footer/FilesFooter'),
      // },
      // {
      //   pageName: 'file',
      //   pagePath: '/files/:path*/:file',
      //   pageComponent: () => import('./pages/FileInfo'),
      //   pageStrict: false,
      //   pageFooterComponent: () => import('./components/footer/FilesFooter'),
      // },
      // {
      //   pageName: 'file',
      //   pagePath: '/file/:id',
      //   pageComponent: () => import('./pages/FileInfo'),
      //   pageFooterComponent: () => import('./components/footer/FilesFooter'),
      // },
    ]
  },

  getPageFooterButtons() {
    return [
      {
        pageName: 'files',
        pagePath: '/files',
        highlightPaths: ['/files', '/file'],
        iconComponent: defineAsyncComponent(() => import('./components/icons/FilesFooterIcon')),
      },
    ]
  },
}

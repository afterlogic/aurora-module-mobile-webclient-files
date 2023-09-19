import eventBus from 'src/event-bus'
import store from 'src/store'
import { defineAsyncComponent } from 'vue'

import { SHARING_LEVELS } from '../enums'

const i18n = {
  $t: {
    OPENPGPFILESWEBCLIENT: {
      HEADING_CREATE_PUBLIC_LINK: 'Create shareable link',
    },
    SHAREDFILES: {
      ACTION_SHARE: 'Share with teammates',
    },
    COREWEBCLIENT: {
      ACTION_SHARE: 'Share',
      ACTION_DOWNLOAD_FILE: 'Download',
      ACTION_REMOVE: 'Remove',
    },
    FILESWEBCLIENT: {
      ACTION_RENAME: 'Rename',
    },
  },
}

const isArchiveElement = (path) => {
  return path.split('.')[path.split('.').length - 1] === 'zip'
}

const isShowAction = (action, items = [], storage, path) => {

  let result = true
  if (items.length && storage && items[0]) {
    switch (action) {
      case 'copy':
        if (isArchiveElement(path)) result = false
        break
      case 'createShareableLink':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        if (items[0].sharedWithMeAccess !== SHARING_LEVELS.NOACCESS) result = false
        break
      case 'shareWithTeammates':
        if (storage === 'corporate') result = false
        if (items[0].sharedWithMeAccess !== SHARING_LEVELS.RESHARE && items[0].sharedWithMeAccess !== SHARING_LEVELS.NOACCESS) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'download':
        if (items[0].isFolder) result = false
        break
      case 'rename':
        if (isArchiveElement(path)) result = false
        break
      case 'delete':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'shareLeave':
        const sharedItems = getSharedWithMeItems(items)
        if (!sharedItems.length) result = false
        break
      default:
        break
    }
  }
  return result
}

const getSharedWithMeItems = (items) => {
  return items.filter( item => item.sharedWithMeAccess !== SHARING_LEVELS.NOACCESS )
}

export const fileActions = {
  copy: {
    method: async () => {
      const currentFile = store.getters['filesmobile/currentFile']
      await store.dispatch('filesmobile/addCopyItems', { items: [currentFile] })
    },
    name: 'copy',
    displayName: 'Copy/Move',
    icon: 'CopyMoveIcon',
    isShowAction: isShowAction,
  },
  createShareableLink: {
    method: null,
    name: 'createShareableLink',
    // component: defineAsyncComponent(() => import('../components/dialogs/CreateShareableLinkDialog')),
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/CreateShareableLinkDialog')) },
    displayName: i18n.$t.OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK,
    icon: 'SecureLinkIcon',
    isShowAction: isShowAction,
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    // component: defineAsyncComponent(() => import('../components/dialogs/ShareWithTeammatesDialog')),
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/ShareWithTeammatesDialog')) },
    displayName: i18n.$t.SHAREDFILES.ACTION_SHARE,
    icon: 'SharingIcon',
    isShowAction: isShowAction,
  },
  shareLeave: {
    method: null,
    name: 'shareLeave',
    // component: defineAsyncComponent(() => import('../components/dialogs/ShareLeaveDialog')),
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/ShareLeaveDialog')) },
    displayName: 'Leave share ',
    icon: 'LeaveSharingIcon',
    isShowAction: isShowAction,
  },
  download: {
    method: (vue) => {
      const file = store.getters['filesmobile/currentFile']
      store.dispatch('filesmobile/changeItemProperty', {
        item: file,
        property: 'downloading',
        value: true,
      })

      if (file.paranoidKey) {
        eventBus.$emit('CoreParanoidEncryptionWebclientPlugin::downloadEncryptedFile', {
          getParentComponent: vue.$root._getParentComponent
        })
      } else {
        store.dispatch('filesmobile/asyncDownloadFile')
      }
    },
    name: 'download',
    displayName: i18n.$t.COREWEBCLIENT.ACTION_DOWNLOAD_FILE,
    icon: 'DownloadIcon',
    isShowAction: isShowAction,
  },
  rename: {
    method: null,
    name: 'rename',
    // component: defineAsyncComponent(() => import('../components/dialogs/RenameItemDialog')),
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/RenameItemDialog')) },
    displayName: i18n.$t.FILESWEBCLIENT.ACTION_RENAME,
    icon: 'RenameIcon',
    isShowAction: isShowAction,
  },
  delete: {
    method: null,
    name: 'delete',
    // component: defineAsyncComponent(() => import('../components/dialogs/DeleteItemsDialog')),
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/DeleteItemsDialog')) },
    displayName: 'Delete',
    icon: 'DeleteIcon',
    isShowAction: isShowAction,
  },
}

export const getFileActions = () => {
  eventBus.$emit('FilesMobileWebClient::getFileActionsList', fileActions)

  return fileActions
}

export const getFileActionsList = (file) => {
  eventBus.$emit('FilesMobileWebClient::getFileActionsList', fileActions)

  //TODO it's not clear what for we need to check id the 'file' is provided.
  // Without the 'file' empty array will be returned. The function caller could just do not call the function fof the same result
  const actions = []
  if (file) {
    Object.keys(fileActions).forEach((key) => {
      actions.push(fileActions[key])
    })
  }
  return actions
}

import eventBus from 'src/event-bus'
import store from 'src/store'

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
        if (items[0].sharedWithMeAccess !== 0) result = false
        break
      case 'shareWithTeammates':
        if (storage === 'corporate') result = false
        if (items[0].sharedWithMeAccess !== 3 && items[0].sharedWithMeAccess !== 0) result = false
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
  return items.filter( item => item.sharedWithMeAccess !== 0 )
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
    component: 'CreateShareableLinkDialog',
    displayName: i18n.$t.OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK,
    icon: 'SecureLinkIcon',
    isShowAction: isShowAction,
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    component: 'ShareWithTeammatesDialog',
    displayName: i18n.$t.SHAREDFILES.ACTION_SHARE,
    icon: 'SharingIcon',
    isShowAction: isShowAction,
  },
  shareLeave: {
    method: null,
    name: 'shareLeave',
    component: 'ShareLeaveDialog',
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
    component: 'RenameItemDialog',
    displayName: i18n.$t.FILESWEBCLIENT.ACTION_RENAME,
    icon: 'RenameIcon',
    isShowAction: isShowAction,
  },
  delete: {
    method: null,
    name: 'delete',
    component: 'DeleteItemsDialog',
    displayName: 'Delete',
    icon: 'DeleteIcon',
    isShowAction: isShowAction,
  },
}

export const getFileActionsList = (file) => {
  const actions = []
  if (file) {
    Object.keys(fileActions).forEach((key) => {
      actions.push(fileActions[key])
    })
  }
  return actions
}

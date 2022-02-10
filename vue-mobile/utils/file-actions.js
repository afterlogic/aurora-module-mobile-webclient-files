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

const isShowAction = (action, file, storage, path) => {
  let result = true
  if (file) {
    switch (action) {
      case 'copy':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'createShareableLink':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'shareWithTeammates':
        if (storage === 'corporate') result = false
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'download':
        if (file.isFolder) result = false
        break
      case 'rename':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      case 'delete':
        if (storage === 'shared') result = false
        if (isArchiveElement(path)) result = false
        break
      default:
        break
    }
  }
  return result
}

export const fileActions = {
  copy: {
    method: async (store) => {
      const currentFile = store.getters['filesmobile/currentFile']
      await store.dispatch('filesmobile/addCopyItems', { items: [currentFile] })
    },
    name: 'copy',
    displayName: 'Copy/Move',
    icon: 'MoveFolderIcon',
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
    icon: 'ShareIcon',
    isShowAction: isShowAction,
  },
  download: {
    method: (store) => {
      const file = store.getters['filesmobile/currentFile']
      store.dispatch('filesmobile/changeItemProperty', {
        item: file,
        property: 'downloading',
        value: true,
      })
      store.dispatch('filesmobile/asyncDownloadFile')
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
    icon: 'EditIcon',
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

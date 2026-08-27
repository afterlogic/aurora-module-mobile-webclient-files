import eventBus from 'src/event-bus'
import { useFilesStore} from '../store/index-pinia'
import { defineAsyncComponent } from 'vue'

import { SHARING_LEVELS, STORAGE_TYPES } from '../enums'
import { getFilesSettings } from '../settings'
import { openExternalLink } from './common'

const isArchiveElement = (path) => {
  return path.split('.')[path.split('.').length - 1] === 'zip'
}

const isAllowFavorites = () => {
  return getFilesSettings()?.allowFavorites !== false
}

const isAllowTrash = () => {
  return getFilesSettings()?.allowTrash !== false
}

export const shouldShowDeleteConfirm = (storage) => {
  if (storage === STORAGE_TYPES.TRASH) {
    return true
  }
  return !isAllowTrash()
}

const getDeletableItems = (filesStore) => {
  if (filesStore.selectedFiles?.length) {
    return filesStore.selectedFiles.filter(
      (item) => item.sharedWithMeAccess === SHARING_LEVELS.NOACCESS
    )
  }
  return filesStore.currentFile ? [filesStore.currentFile] : []
}

const buildDeleteApiItems = (items) => {
  return items.map((file) => ({
    Path: file.path,
    Name: file.name,
    IsFolder: file.isFolder,
  }))
}

const openDeleteDialog = (filesStore) => {
  filesStore.changeDialogComponent({
    getComponent: () => defineAsyncComponent(() => import('../components/dialogs/DeleteItemsDialog')),
  })
}

const isShowAction = (action, items = [], storage, path) => {

  let result = true
  if (items.length && storage && items[0]) {
    switch (action) {
      case 'addToFavorites':
        if (!isAllowFavorites()) result = false
        if (storage !== STORAGE_TYPES.PERSONAL) result = false
        if (items[0].favorite) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'removeFromFavorites':
        if (!isAllowFavorites()) result = false
        if (!items[0].favorite) result = false
        if (storage !== STORAGE_TYPES.PERSONAL && storage !== STORAGE_TYPES.FAVORITES) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'copy':
        if (storage === STORAGE_TYPES.TRASH) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'createShareableLink':
      case 'createSecureShareableLink':
        if (storage === STORAGE_TYPES.SHARED || storage === STORAGE_TYPES.TRASH) result = false
        if (isArchiveElement(path)) result = false
        if (items[0].sharedWithMeAccess !== SHARING_LEVELS.NOACCESS) result = false
        break
      case 'shareWithTeammates':
        if (storage === STORAGE_TYPES.CORPORATE || storage === STORAGE_TYPES.TRASH) result = false
        if (items[0].sharedWithMeAccess !== SHARING_LEVELS.RESHARE && items[0].sharedWithMeAccess !== SHARING_LEVELS.NOACCESS) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'download':
        if (items[0].isFolder) result = false
        if (items[0].isLink) result = false
        break
      case 'openLink':
        if (!items[0].isLink) result = false
        break
      case 'rename':
        if (storage === STORAGE_TYPES.TRASH) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'delete':
        if (storage === STORAGE_TYPES.SHARED) result = false
        if (isArchiveElement(path)) result = false
        break
      case 'restore':
        if (storage !== STORAGE_TYPES.TRASH) result = false
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
      const filesStore = useFilesStore()
      const currentFile = filesStore.currentFile
      await filesStore.addCopyItems({ items: [currentFile] })
    },
    name: 'copy',
    displayNameKey: 'FILESWEBCLIENT.ACTION_COPY_MOVE',
    icon: 'CopyMoveIcon',
    isShowAction: isShowAction,
  },
  addToFavorites: {
    method: async () => {
      const filesStore = useFilesStore()
      await filesStore.asyncToggleFavorite({
        item: filesStore.currentFile,
        add: true,
      })
    },
    name: 'addToFavorites',
    displayNameKey: 'FILESWEBCLIENT.ACTION_ADD_TO_FAVORITES',
    icon: 'FavoriteIcon',
    isShowAction: isShowAction,
  },
  removeFromFavorites: {
    method: async () => {
      const filesStore = useFilesStore()
      await filesStore.asyncToggleFavorite({
        item: filesStore.currentFile,
        add: false,
      })
    },
    name: 'removeFromFavorites',
    displayNameKey: 'FILESWEBCLIENT.ACTION_REMOVE_FROM_FAVORITES',
    icon: 'FavoriteIcon',
    isShowAction: isShowAction,
  },
  createShareableLink: {
    method: null,
    name: 'createShareableLink',
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/CreateShareableLinkDialog')) },
    displayNameKey: 'FILESWEBCLIENT.LABEL_PUBLIC_LINK',
    icon: 'SecureLinkIcon',
    isShowAction: isShowAction,
  },
  shareWithTeammates: {
    method: null,
    name: 'shareWithTeammates',
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/ShareWithTeammatesDialog')) },
    displayNameKey: 'SHAREDFILES.ACTION_SHARE',
    icon: 'SharingIcon',
    isShowAction: isShowAction,
  },
  shareLeave: {
    method: null,
    name: 'shareLeave',
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/ShareLeaveDialog')) },
    displayNameKey: 'SHAREDFILES.ACTION_LEAVE_SHARE',
    icon: 'LeaveSharingIcon',
    isShowAction: isShowAction,
  },
  download: {
    method: (vue) => {
      const filesStore = useFilesStore()
      const file = filesStore.currentFile
      filesStore.changeItemProperty({
        item: file,
        property: 'downloading',
        value: true,
      })

      if (file.paranoidKey) {
        eventBus.$emit('CoreParanoidEncryptionWebclientPlugin::downloadEncryptedFile', {
          getParentComponent: vue.$root._getParentComponent
        })
      } else {
        filesStore.asyncDownloadFile()
      }
    },
    name: 'download',
    displayNameKey: 'COREWEBCLIENT.ACTION_DOWNLOAD_FILE',
    icon: 'DownloadIcon',
    isShowAction: isShowAction,
  },
  openLink: {
    method: () => {
      const filesStore = useFilesStore()
      const file = filesStore.currentFile
      openExternalLink(file?.linkUrl || file?.openUrl)
    },
    name: 'openLink',
    displayNameKey: 'COREWEBCLIENT.ACTION_OPEN_LINK',
    icon: 'OpenLinkIcon',
    isShowAction: isShowAction,
  },
  rename: {
    method: null,
    name: 'rename',
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/RenameItemDialog')) },
    displayNameKey: 'FILESWEBCLIENT.ACTION_RENAME',
    icon: 'RenameIcon',
    isShowAction: isShowAction,
  },
  delete: {
    method: async () => {
      const filesStore = useFilesStore()
      const storage = filesStore.currentStorage?.Type
      const items = getDeletableItems(filesStore)
      if (!items.length) {
        return
      }

      if (!shouldShowDeleteConfirm(storage)) {
        const result = await filesStore.asyncDeleteItems({ items: buildDeleteApiItems(items) })
        if (result) {
          await filesStore.changeItemsLists({ items })
          await filesStore.selectFile(null)
          filesStore.resetSelectedItems?.({ items })
        }
        return
      }

      openDeleteDialog(filesStore)
    },
    name: 'delete',
    displayNameKey: 'COREWEBCLIENT.ACTION_DELETE',
    icon: 'DeleteIcon',
    isShowAction: isShowAction,
  },
  restore: {
    method: null,
    name: 'restore',
    getComponent: () => { return defineAsyncComponent(() => import('../components/dialogs/RestoreItemsDialog')) },
    displayNameKey: 'FILESWEBCLIENT.ACTION_RESTORE',
    icon: 'RestoreIcon',
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

import { getFilteredItems, getStorageIconName } from '../utils/common'
import { pathSegmentsToApiPath } from '../utils/path'
import { STORAGE_TYPES } from '../enums'
import { getFilesSettings } from '../settings'

export default {
  // Do not add getters with the same name as state (e.g. currentPath):
  // Pinia then shadows state and assignments like this.currentPath = ... break.
  currentPathString: (state) => pathSegmentsToApiPath(state.currentPath),
  currentStorageIconName: (state) => getStorageIconName(state.currentStorage?.Type),
  isFavoritesStorage: (state) => state.currentStorage?.Type === STORAGE_TYPES.FAVORITES,
  isTrashStorage: (state) => state.currentStorage?.Type === STORAGE_TYPES.TRASH,
  isCreateAllowed: (state) => {
    const storageType = state.currentStorage?.Type
    return storageType !== STORAGE_TYPES.SHARED
      && storageType !== STORAGE_TYPES.FAVORITES
      && storageType !== STORAGE_TYPES.TRASH
  },
  isCreateShortcutAllowed: (state) => {
    if (getFilesSettings()?.disableShortcuts) {
      return false
    }
    const storage = state.currentStorage
    const storageType = storage?.Type
    if (
      storageType === STORAGE_TYPES.SHARED
      || storageType === STORAGE_TYPES.FAVORITES
      || storageType === STORAGE_TYPES.TRASH
      || storageType === STORAGE_TYPES.ENCRYPTED
    ) {
      return false
    }
    if (storage?.IsExternal) {
      return false
    }
    return true
  },
  loadingStatus: (state) => state.isLoading,
  isArchive: (state) => {
    return false
    // return state.currentPath.split('.')[state.currentPath.split('.').length - 1] === 'zip'
  },
  selectedFiles: (state) => {
    const files = getFilteredItems(state.fileList, 'isSelected')
    const folders = getFilteredItems(state.folderList, 'isSelected')
    return folders.concat(files)
  },
  copiedFiles: (state) => state.itemsToCopy,
  copyMoveParameters: (state) => {
    if (!state.itemsToCopy.length) {
      return null
    }

    const copiedFile = state.itemsToCopy[0]
    const items = []
    state.itemsToCopy.forEach((file) => {
      items.push({
        FromPath: file.path,
        FromType: file.type,
        Name: file.name,
        IsFolder: file.isFolder,
      })
    })
    const toPath = pathSegmentsToApiPath(state.currentPath)
    return {
      ToType: state.currentStorage.Type,
      ToPath: toPath,
      FromType: copiedFile.type,
      FromPath: copiedFile.path,
      Files: items,
    }
  },
}

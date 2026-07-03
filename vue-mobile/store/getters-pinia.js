import { getFilteredItems } from '../utils/common'
import { pathSegmentsToApiPath } from '../utils/path'

export default {
  // Do not add getters with the same name as state (e.g. currentPath):
  // Pinia then shadows state and assignments like this.currentPath = ... break.
  currentPathString: (state) => pathSegmentsToApiPath(state.currentPath),
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

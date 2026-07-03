import { getFilteredItems } from '../utils/common'
import { pathSegmentsToApiPath } from '../utils/path'

export default {
  storageList: (state) => state.storageList,
  fileList: (state) => state.fileList,
  folderList: (state) => state.folderList,
  filesQuota: (state) => state.filesQuota,
  currentStorage: (state) => state.currentStorage,
  loadingStatus: (state) => state.isLoading,
  currentPathString: (state) => pathSegmentsToApiPath(state.currentPath),
  currentPath: (state) => state.currentPath,
  currentFile: (state) => state.currentFile,
  downloadFiles: (state) => state.downloadFiles,
  currentHeader: (state) => state.currentHeader,
  searchText: (state) => state.searchText,
  isArchive: (state) => {
    return false
    // return state.currentPath.split('.')[state.currentPath.split('.').length - 1] === 'zip'
  },
  selectedFiles: (state) => {
    const files = getFilteredItems(state.fileList, 'isSelected')
    const folders = getFilteredItems(state.folderList, 'isSelected')
    return folders.concat(files)
  },
  dialogComponent: (state) => state.dialogComponent ? state.dialogComponent : { component: '' },
  copiedFiles: (state) => state.itemsToCopy,
  getCopyMoveParameters: (state) => {
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

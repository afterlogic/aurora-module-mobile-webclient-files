import { getFilteredItems } from 'src/utils/files/utils'
export default {
  storageList: (state) => state.storageList,
  filesList: (state) => state.filesList,
  foldersList: (state) => state.foldersList,
  filesQuota: (state) => state.filesQuota,
  currentStorage: (state) => state.currentStorage,
  loadingStatus: (state) => state.isLoading,
  currentPaths: (state) => state.currentPaths,
  currentPath: (state) => state.currentPath,
  currentFile: (state) => state.currentFile,
  downloadFiles: (state) => state.downloadFiles,
  currentHeader: (state) => state.currentHeader,
  searchText: (state) => state.searchText,
  isArchive: (state) => {
    return (
      state.currentPath.split('.')[state.currentPath.split('.').length - 1] ===
      'zip'
    )
  },
  selectedFiles: (state) => {
    const files = getFilteredItems(state.filesList, 'isSelected')
    const folders = getFilteredItems(state.foldersList, 'isSelected')
    return folders.concat(files)
  },
  dialogComponent: (state) =>
    state.dialogComponent ? state.dialogComponent : { component: '' },
  copiedFiles: (state) => state.copyItems,
  getCopyMoveParameters: (state) => {
    const copiedFile = state.copyItems[0]
    const items = []
    state.copyItems.forEach((file) => {
      items.push({
        FromPath: file.path,
        FromType: file.type,
        Name: file.name,
        IsFolder: file.isFolder,
      })
    })
    return {
      ToType: state.currentStorage.Type,
      ToPath: state.currentPath,
      FromType: copiedFile.type,
      FromPath: copiedFile.path,
      Files: items,
    }
  },
}

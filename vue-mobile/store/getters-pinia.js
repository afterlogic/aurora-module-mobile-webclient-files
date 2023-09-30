import { getFilteredItems } from '../utils/common'

export default {
  currentPathString: (state) => ( '/' + (state.currentPath.length > 0 ? state.currentPath.join('/') : '') ),
  isArchive: (state) => {
    return false
    // return state.currentPath.split('.')[state.currentPath.split('.').length - 1] === 'zip'
  },
  selectedFiles: (state) => {
    const files = getFilteredItems(state.fileList, 'isSelected')
    const folders = getFilteredItems(state.folderList, 'isSelected')
    return folders.concat(files)
  },
  copiedFiles: (state) => state.copyItems,
  copyMoveParameters: (state) => {
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

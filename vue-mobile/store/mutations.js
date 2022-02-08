export default {
  SET_STORAGE_LIST: (state, storages) => (state.storageList = storages),
  SET_FILES_LIST: (state, filesList) => (state.filesList = filesList),
  SET_FOLDERS_LIST: (state, foldersList) => (state.foldersList = foldersList),
  SET_FILES_QUOTA: (state, filesQuota) => (state.filesQuota = filesQuota),
  SET_CURRENT_STORAGE: (state, currentStorage) =>
    (state.currentStorage = currentStorage),
  SET_LOADING_STATUS: (state, status) => (state.isLoading = status),
  SET_CURRENT_PATH: (state, { path }) => (state.currentPath = path),
  SET_CURRENT_FILE: (state, file) => (state.currentFile = file),
  SET_FILE_NAME: (state, fileName) => (state.currentFile.name = fileName),
  SET_CURRENT_HEADER_NAME: (state, headerName) =>
    (state.currentHeader = headerName),
  SET_SEARCH_TEXT: (state, text) => (state.searchText = text),
  CHANGE_CURRENT_PATH: (state, { path, index, lastStorage }) => {
    if (!lastStorage) {
      if (index === -1) {
        state.currentPaths.push(path)
      } else {
        state.currentPaths.splice(index + 1)
      }
    } else {
      state.currentPaths = [path]
    }
  },

  REMOVE_FOLDERS: (state, folders) => {
    folders.forEach((folder) => {
      const itemIndex = state.foldersList.findIndex(
        (item) => item.hash === folder.hash
      )
      if (itemIndex !== -1) {
        state.foldersList.splice(itemIndex, 1)
      }
    })
  },
  REMOVE_FILES: (state, files) => {
    files.forEach((file) => {
      const itemIndex = state.filesList.findIndex(
        (item) => item.hash === file.hash
      )
      if (itemIndex !== -1) {
        state.filesList.splice(itemIndex, 1)
      }
    })
  },
  SET_SELECT_STATUS: (state) =>
    (state.currentFile.isSelected = !state.currentFile.isSelected),
  REMOVE_SELECTED_ITEMS: (state, items) => {
    if (items.length) {
      items.forEach((item) => {
        item.isSelected = false
      })
    }
  },
  SET_DIALOG_COMPONENT: (state, dialogComponent) =>
    (state.dialogComponent = dialogComponent),
  SET_COPY_ITEMS: (state, items) => (state.copyItems = items),
  SET_ITEMS_COPY_STATUS: (state, { items, status }) => {
    items.forEach((item) => {
      item.isCopied = status
    })
  },
  SET_COPY_ITEMS_STATUS: (state, { status }) => {
    state.filesList.forEach((item) => {
      if (item.isCopied) {
        item.isCopied = status
      }
    })
    state.foldersList.forEach((item) => {
      if (item.isCopied) {
        item.isCopied = status
      }
    })
  },
  SET_ITEM_PROPERTY: (state, { item, property, value }) =>
    (item[property] = value),
  REMOVE_COPIED_FILES: (state) => (state.copyItems = []),
  SET_DOWNLOADS_FILES: (state, files) =>
    (state.downloadFiles = state.downloadFiles.concat(files)),
  REMOVE_UPLOADED_FILES: (state) => {
    const downloadableFiles = []
    state.downloadFiles.forEach((file) => {
      if (file.file.__progress !== 1) {
        downloadableFiles.push(file)
      }
    })
    state.downloadFiles = downloadableFiles
  },
}
// files.forEach(file => {
//   const index = state.downloadFiles.findIndex(currentFile => {
//     return currentFile.name === file.name && currentFile.size === file.size
//   })
//   if (index + 1) {
//     state.downloadFiles[index] = file
//   } else {
//     state.downloadFiles.push(file)
//   }
// })

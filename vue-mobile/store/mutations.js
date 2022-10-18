export default {
  setStorageList: (state, storages) => { state.storageList = storages },
  setFileList: (state, fileList) => { state.fileList = fileList },
  setFolderList: (state, folderList) => { state.folderList = folderList },
  setFilesQuota: (state, filesQuota) => { state.filesQuota = filesQuota },

  setCurrentStorage: (state, currentStorage) => { state.currentStorage = currentStorage },
  setCurrentPath: (state, { path }) => { state.currentPath = path },
  setCurrentFile: (state, file) => { state.currentFile = file },
  setLoadingStatus: (state, status) => { state.isLoading = status },
  
  setFileName: (state, fileName) => { state.currentFile.name = fileName },
  setCurrentHeader: (state, headerName) => { state.currentHeader = headerName },
  setSearchText: (state, text) => { state.searchText = text },

  // changeCurrentPath: (state, { path, index, lastStorage }) => {
  //   if (!lastStorage) {
  //     if (index === -1) {
  //       state.currentPath.push(path)
  //     } else {
  //       state.currentPath.splice(index + 1)
  //     }
  //   } else {
  //     state.currentPath = [path]
  //   }
  // },

  removeFolders: (state, folders) => {
    folders.forEach((folder) => {
      const itemIndex = state.folderList.findIndex(
        (item) => item.hash === folder.hash
      )
      if (itemIndex !== -1) {
        state.folderList.splice(itemIndex, 1)
      }
    })
  },

  removeFiles: (state, files) => {
    files.forEach((file) => {
      const itemIndex = state.fileList.findIndex(
        (item) => item.hash === file.hash
      )
      if (itemIndex !== -1) {
        state.fileList.splice(itemIndex, 1)
      }
    })
  },

  setSelectStatus: (state, item) => {
    // state.currentFile.isSelected = !state.currentFile.isSelected
    item.isSelected = !item.isSelected
  },

  removeSelectedItems: (state, items) => {
    if (items.length) {
      items.forEach((item) => {
        item.isSelected = false
      })
    }
  },

  setDialogComponent: (state, dialogComponent) => { state.dialogComponent = dialogComponent },

  setCopyItems: (state, items) => { state.copyItems = items },
  
  setItemsCopyStatus: (state, { items, status }) => {
    items.forEach((item) => {
      item.isCopied = status
    })
  },
  
  setCopyItemsStatus: (state, { status }) => {
    state.fileList.forEach((item) => {
      if (item.isCopied) {
        item.isCopied = status
      }
    })
    state.folderList.forEach((item) => {
      if (item.isCopied) {
        item.isCopied = status
      }
    })
  },

  setItemProperty: (state, { item, property, value }) => { item[property] = value },
  removeCopiedFiles: (state) => { state.copyItems = [] },
  setDownloadFiles: (state, files) => { state.downloadFiles = state.downloadFiles.concat(files) },
  removeUploadedFiles: (state) => {
    const downloadableFiles = []
    state.downloadFiles.forEach((file) => {
      if (file.file.__progress !== 1) {
        downloadableFiles.push(file)
      }
    })
    state.downloadFiles = downloadableFiles
  },
  removeSelectedUploadedFiles: (state, files) => {
    files.forEach( file => {
      const fileIndex = state.downloadFiles.findIndex( downloadFile =>  downloadFile.name === file.name)
      if (fileIndex + 1) {
        state.downloadFiles.splice(fileIndex, 1)
      }
    })
  },
  setFileUploadProgress: (state, { item, value }) => {
    if (item.file) {
      item.file.__progress = value
    }
  }
}

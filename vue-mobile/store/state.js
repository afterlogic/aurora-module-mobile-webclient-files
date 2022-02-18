export default function () {
  return {
    storageList: [],
    fileList: [],
    folderList: [],
    copyItems: [],
    downloadFiles: [],
    filesQuota: {},
    currentStorage: '',
    currentHeader: '',
    isLoading: false,
    searchText: '',

    dialogComponent: null,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}

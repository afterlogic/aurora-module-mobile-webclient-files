export default function () {
  return {
    storageList: [],
    fileList: [],
    folderList: [],
    filesQuota: {},

    copyItems: [],
    downloadFiles: [],

    currentStorage: '',
    currentFile: null,
    currentPath: [],

    currentHeader: '',
    isLoading: false,
    searchText: '',

    dialogComponent: null,
  }
}

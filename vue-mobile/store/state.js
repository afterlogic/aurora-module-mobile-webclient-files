export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
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

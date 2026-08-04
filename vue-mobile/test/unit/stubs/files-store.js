export function useFilesStore() {
  return {
    currentFile: null,
    currentStorage: { Type: 'personal' },
    selectedFiles: [],
    folderList: [],
    fileList: [],
    addCopyItems: async () => {},
    changeItemProperty: () => {},
    asyncDownloadFile: () => {},
    asyncDeleteItems: async () => true,
    asyncEmptyTrash: async () => true,
    changeItemsLists: async () => {},
    selectFile: async () => {},
    resetSelectedItems: () => {},
    changeDialogComponent: () => {},
    asyncRestoreItems: async () => true,
  }
}

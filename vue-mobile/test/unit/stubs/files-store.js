export function useFilesStore() {
  return {
    currentFile: null,
    currentStorage: { Type: 'personal' },
    selectedFiles: [],
    addCopyItems: async () => {},
    changeItemProperty: () => {},
    asyncDownloadFile: () => {},
    asyncDeleteItems: async () => true,
    changeItemsLists: async () => {},
    selectFile: async () => {},
    resetSelectedItems: () => {},
    changeDialogComponent: () => {},
    asyncRestoreItems: async () => true,
  }
}

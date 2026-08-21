import types from 'src/utils/types'
import { getApiHost } from 'src/api/helpers'
import _ from 'lodash'
import filesWebApi from '../files-web-api'
import {
  getParsedFiles,
  getParseFolders,
  getFiles,
  getFolders,
  getStorageIconName,
  resolveDeleteStorageType,
} from '../utils/common'
import {
  parseContactSuggestion,
  enrichContactSuggestionsWithPgpKeys,
} from '../../../ContactsMobileWebclient/vue-mobile/utils/common'
import openpgpWebApi from '../../../OpenPgpMobileWebclient/vue-mobile/openpgp-web-api'
import { normalizeRoutePath } from '../utils/path'
import { STORAGE_TYPES } from '../enums'

let getFilesRequestId = 0

export default {
  async asyncGetStorages() {
    const storages = await filesWebApi.getStorages()
    if (types.pArray(storages)) {
      this.storageList = storages.map((storage) => ({
        ...storage,
        iconName: getStorageIconName(storage.Type),
      }))
      this.currentStorage = this.storageList.length ? this.storageList[0] : {}
    }
  },
  async asyncGetFiles() {
    if (!this.currentStorage?.Type) {
      return
    }

    const requestId = ++getFilesRequestId
    this.isLoading = true

    const parameters = {
      Type: this.currentStorage.Type,
      Path: this.currentPathString,
      Pattern: this.searchText,
      PathRequired: false,
    }
    const data = await filesWebApi.getFiles(parameters)

    if (requestId !== getFilesRequestId) {
      return
    }

    if (_.isArray(data?.Items)) {
      this.folderList = getParseFolders(data.Items)
      this.fileList = getParsedFiles(data.Items)
    } else {
      this.folderList = []
      this.fileList = []
    }
    if (types.pObject(data?.Quota)) {
      this.filesQuota = data.Quota
    }
    this.isLoading = false
  },
  clearItemLists() {
    this.folderList = []
    this.fileList = []
  },
  changeCurrentStorage(storage) {
    this.currentStorage = storage
  },
  changeLoadingStatus(status) {
    this.isLoading = !!status
  },
  changeCurrentPath({ path }) {
    this.currentPath = normalizeRoutePath(path)
  },
  async asyncRenameItem({ file, itemName }) {
    const storageType = this.currentStorage?.Type === STORAGE_TYPES.FAVORITES && file?.type
      ? file.type
      : this.currentStorage?.Type
    const parameters = {
      Type: storageType,
      Path: file.path,
      Name: file.name,
      NewName: itemName,
      IsLink: 0,
      IsFolder: file.isFolder,
    }
    return await filesWebApi.renameItem(parameters)
  },
  changeFileName(fileName) {
    const file = this.currentFile
    if (!file) {
      return
    }

    const oldName = file.name
    file.name = fileName

    if (file.fullPath) {
      if (file.fullPath.endsWith('/' + oldName)) {
        file.fullPath = file.fullPath.slice(0, -(oldName.length + 1)) + '/' + fileName
      } else if (file.fullPath === '/' + oldName) {
        file.fullPath = '/' + fileName
      } else if (file.fullPath.endsWith(oldName)) {
        file.fullPath = file.fullPath.slice(0, -oldName.length) + fileName
      }
    }

    if (file.id === oldName) {
      file.id = fileName
    }
  },
  selectFile(file) {
    this.currentFile = file
  },
  
  async asyncDeleteItems({ items }) {
    const sourceItem = this.selectedFiles?.[0] || this.currentFile || items[0]
    const storageType = resolveDeleteStorageType(this.currentStorage?.Type, sourceItem)
    const parameters = {
      Type: storageType,
      Path: this.currentPathString,
      Items: items,
    }
    return await filesWebApi.deleteItems(parameters)
  },

  async asyncEmptyTrash() {
    const items = [...this.folderList, ...this.fileList]
    if (!items.length) {
      return false
    }

    const groups = {}
    items.forEach((item) => {
      const storageType = resolveDeleteStorageType(this.currentStorage?.Type, item)
      if (!groups[storageType]) {
        groups[storageType] = []
      }
      groups[storageType].push({
        Path: item.path,
        Name: item.name,
        IsFolder: item.isFolder,
      })
    })

    const results = await Promise.all(
      Object.entries(groups).map(([storageType, groupItems]) =>
        filesWebApi.deleteItems({
          Type: storageType,
          Path: this.currentPathString,
          Items: groupItems,
        })
      )
    )

    const success = results.every(Boolean)
    if (success) {
      this.clearItemLists()
      this.selectFile(null)
    }
    return success
  },

  async asyncRestoreItems({ items }) {
    return await filesWebApi.restoreItems({ Items: items })
  },

  changeItemsLists({ items }) {
    const files = getFiles(items)
    const folders = getFolders(items)
    if (folders.length) {
      folders.forEach((folder) => {
        const itemIndex = this.folderList.findIndex((item) => item.hash === folder.hash)
        if (itemIndex !== -1) {
          this.folderList.splice(itemIndex, 1)
        }
      })
    }
    if (files.length) {
      files.forEach((file) => {
        const itemIndex = this.fileList.findIndex((item) => item.hash === file.hash)
        if (itemIndex !== -1) {
          this.fileList.splice(itemIndex, 1)
        }
      })
    }
  },
  resetSelectedItems({ items }) {
    if (items.length) {
      items.forEach((item) => { item.isSelected = false })
    }
  },
  changeDialogComponent(dialogComponent) {
    this.dialogComponent = dialogComponent
  },
  addCopyItems({ items }) {
    items.forEach((item) => { item.isCopied = true })
    this.itemsToCopy = items
  },
  removeCopiedFiles() {
    this.fileList.forEach((item) => { item.isCopied = false })
    this.folderList.forEach((item) => { item.isCopied = false })
    this.itemsToCopy = []
  },
  async copyItems() {
    const parameters = this.copyMoveParameters
    if (!parameters) {
      return
    }
    const result = await filesWebApi.copyMoveItems(parameters, 'Copy')
    if (result) {
      this.removeCopiedFiles()
      this.asyncGetFiles()
    }
  },
  async moveItems() {
    const parameters = this.copyMoveParameters
    if (!parameters) {
      return
    }
    const result = await filesWebApi.copyMoveItems(parameters, 'Move')
    if (result) {
      this.removeCopiedFiles()
      this.asyncGetFiles()
    }
  },

  async asyncCreateFolder({ name }) {
    const currentStorage = this.currentStorage
    const parameters = {
      Type: currentStorage.Type,
      Path: this.currentPathString,
      FolderName: name,
    }
    return await filesWebApi.createFolder(parameters)
  },

  /**
   * Creates a simple public link via the Files module (PersonalFiles implements it).
   * Password-protected / OpenPgp links are owned by OpenPgpFilesMobileWebclient.
   */
  async asyncCreateShareableLink() {
    const currentFile = this.currentFile
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
      Size: currentFile.size,
      IsFolder: currentFile.isFolder,
    }
    const result = await filesWebApi.createShareableLink(parameters)
    if (result) {
      currentFile.publicLink = `${getApiHost()}${result}`
      currentFile.linkPassword = ''
    }
    return result
  },
  async asyncDeletePublicLink() {
    const currentFile = this.currentFile
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
    }
    const result = await filesWebApi.deletePublicLink(parameters)
    if (result) {
      currentFile.publicLink = ''
      currentFile.linkPassword = ''
    }
    return result
  },
  async asyncUpdateShare(parameters) {
    const result = await filesWebApi.updateShare(parameters)
    if (result) {
      const currentFile = this.currentFile
      currentFile.shares = parameters.Shares
      return true
    }
    return false
  },
  async asyncGetHistory({ resourceType, resourceId, offset, limit }) {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
      Offset: offset,
      Limit: limit,
    }
    return filesWebApi.getHistory(parameters)
  },
  async asyncClearHistory ({ resourceType, resourceId }) {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
    }
    return filesWebApi.clearHistory(parameters)
  },
  addDownloadsFiles(files) {
    this.downloadFiles = this.downloadFiles.concat(files)
  },
  removeUploadedFiles() {
    const downloadableFiles = []
    this.downloadFiles.forEach((file) => {
      if (file.file.__progress !== 1) {
        downloadableFiles.push(file)
      }
    })
    this.downloadFiles = downloadableFiles
  },
  removeSelectedUploadedFiles(files) {
    files.forEach(file => {
      const fileIndex = this.downloadFiles.findIndex( downloadFile =>  downloadFile.name === file.name)
      if (fileIndex + 1) {
        this.downloadFiles.splice(fileIndex, 1)
      }
    })
  },
  changeUploadingStatus({ file, status }) {
    file.isUploading = status
  },
  changeFileUploadProgress({ item, value }) {
    if (item.file) {
      item.file.__progress = value
    }
  },
  changeItemProperty({ item, property, value }) {
    item[property] = value
  },
  async asyncDownloadFile() {
    const file = this.currentFile
    await filesWebApi.downloadFile(file)
  },
  async asyncLeaveShare() {
    const selectedItems = this.selectedFiles
    const currentStorage = this.currentStorage
    const currentPath = this.currentPathString

    const items = []

    selectedItems.forEach( item => {
      if (item.sharedWithMeAccess) {
        items.push({
          Path: item.path,
          Name: item.name,
          IsFolder: item.isFolder
        })
      }
    } )
    if (!items.length) {
      const currentFile = this.currentFile
      items.push({
        Path: currentFile.path,
        Name: currentFile.name,
        IsFolder: currentFile.isFolder
      })
    }
    const sourceItem = selectedItems[0] || this.currentFile
    const storageType = resolveDeleteStorageType(currentStorage?.Type, sourceItem)
    const parameters = {
      Type: storageType,
      Path: currentPath,
      Items: items
    }
    const result = await filesWebApi.leaveShare(parameters)
    if (result) {
      this.changeItemsLists({ items: selectedItems.length ? selectedItems : [this.currentFile] })
    }
    return result
  },
  changeCurrentHeader(headerName) {
    this.currentHeader = headerName
  },
  changeSearchText(text) {
    this.searchText = text
  },
  async getContactSuggestions(params) {
    const list = await filesWebApi.getContactSuggestions(params)
    if (!Array.isArray(list) || !list.length) {
      return []
    }

    let contacts = list.map(parseContactSuggestion)
    contacts = await enrichContactSuggestionsWithPgpKeys(
      contacts,
      openpgpWebApi.getPublicKeysByContactUUIDs
    )
    return contacts
  },
  async asyncUpdateExtendedProps({ type, path, name, paranoidKey }) {
    const parameters = {
      Type: type,
      Path: path,
      Name: name,
      ExtendedProps: {}
    }
    parameters.ExtendedProps[paranoidKey.key] = paranoidKey.value
    return await filesWebApi.updateExtendedProps(parameters)
  },
  async asyncGetExtendedPropsShares(params) {
    const result = await filesWebApi.getExtendedProps(params)
    if (_.isArray(result?.Shares)) {
      return result?.Shares
    }
    return false
  },

  async asyncToggleFavorite({ item, add }) {
    const parameters = {
      Items: [{
        Type: STORAGE_TYPES.PERSONAL,
        Path: item.path,
        Name: item.name,
      }],
    }
    const originalState = item.favorite
    item.favorite = add

    const result = add
      ? await filesWebApi.addToFavorites(parameters)
      : await filesWebApi.removeFromFavorites(parameters)

    if (add) {
      item.favorite = !!result
    } else {
      item.favorite = !result
    }

    if (!result) {
      item.favorite = originalState
      return false
    }

    if (!add && this.currentStorage?.Type === STORAGE_TYPES.FAVORITES) {
      this.changeItemsLists({ items: [item] })
    }

    return true
  },
}

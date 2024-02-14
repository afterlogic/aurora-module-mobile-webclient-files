import types from 'src/utils/types'
import { getApiHost } from 'src/api/helpers'
import OpenPgp from "../../../OpenPgpMobileWebclient/vue-mobile/openpgp-helper";
import _ from 'lodash'
import filesWebApi from '../files-web-api'
import {
  getParsedFiles,
  getParseFolders,
  getFiles,
  getFolders,
} from '../utils/common'

export default {
  async asyncGetStorages() {
    const storages = await filesWebApi.getStorages()
    if (types.pArray(storages)) {
      this.storageList = storages
      this.currentStorage = storages.length ? storages[0] : {}
    }
  },
  async asyncGetFiles() {
    this.changeLoadingStatus(true)
    const parameters = {
      Type: this.currentStorage?.Type,
      Path: this.currentPathString,
      Pattern: this.searchText,
      PathRequired: false,
    }
    const data = await filesWebApi.getFiles(parameters)
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
    this.changeLoadingStatus(false)
  },
  clearItemLists() {
    this.folderList = []
    this.fileList = []
  },
  changeCurrentStorage(storage) {
    this.currentStorage = storage
  },
  changeLoadingStatus() {
    this.isLoading = true
  },
  changeCurrentPath({ path }) {
    this.currentPath = path || []
  },
  async asyncRenameItem({ file, itemName }) {
    const parameters = {
      Type: state.currentStorage.Type,
      Path: file.path,
      Name: file.name,
      NewName: itemName,
      IsLink: 0,
      IsFolder: file.isFolder,
    }
    return await filesWebApi.renameItem(parameters)
  },
  changeFileName(fileName) {
    this.currentFile.name = fileName
  },
  selectFile(file) {
    this.currentFile = file
  },
  
  async asyncDeleteItems({ items }) {
    const parameters = {
      Type: this.currentStorage?.Type,
      Path: this.currentPathString,
      Items: items,
    }
    return await filesWebApi.deleteItems(parameters)
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
  //TODO make copyItems computed
  addCopyItems({ items }) {
    items.forEach((item) => { item.isCopied = true })
    this.copyItems = items
  },
  removeCopiedFiles() {
    this.fileList.forEach((item) => { item.isCopied = false })
    this.folderList.forEach((item) => { item.isCopied = false })
    this.copyItems = []
  },
  async copyItems() {
    const parameters = this.copyMoveParameters
    const result = await filesWebApi.copyMoveItems(parameters, 'Copy')
    if (result) {
      this.removeCopiedFiles()
      this.asyncGetFiles()
    }
  },
  async moveItems() {
    const parameters = this.copyMoveParameters
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

  async asyncCreateShareableLink({ withPassword }) {
    const currentFile = this.currentFile
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
      Size: currentFile.size,
      IsFolder: currentFile.isFolder,
      RecipientEmail: '',
      PgpEncryptionMode: '',
      LifetimeHrs: 0,
      Password: withPassword ? OpenPgp.generatePassword() : '',
    }
    const module = 'OpenPgpFilesWebclient'
    const result = await filesWebApi.createShareableLink(parameters, module)
    if (result) {
      currentFile.publicLink = `${getApiHost()}${result}`
      if (parameters.Password) {
        currentFile.linkPassword = parameters.Password
      }
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
    const parameters = {
      Type: currentStorage.Type,
      Path: currentPath,
      Items: items
    }
    const result =  await filesWebApi.leaveShare(parameters)
    if (result) {
      dispatch('changeItemsLists', { items })
    }
  },
  changeCurrentHeader(headerName) {
    this.currentHeader = headerName
  },
  changeSearchText(text) {
    this.searchText = text
  },
  async getContactSuggestions(params) {
    return await filesWebApi.getContactSuggestions(params)
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
  }
}

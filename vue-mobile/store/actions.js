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
  asyncGetStorages: async ({ commit, dispatch }) => {
    const storages = await filesWebApi.getStorages()
    if (types.pArray(storages)) {
      commit('setStorageList', storages)
      commit('setCurrentStorage', storages.length ? storages[0] : {})
      if (storages.length) {
        const path = {
          path: '',
          name: storages[0].DisplayName,
        }
        dispatch('changeCurrentPaths', {
          path,
          lastStorage: true,
        })
      }
    }
  },
  asyncGetFiles: async ({ commit, getters, dispatch }) => {
    dispatch('changeLoadingStatus', true)
    const currentStorage = getters['currentStorage']
    const currentPath = getters['currentPath']
    const parameters = {
      Type: currentStorage?.Type,
      Path: currentPath,
      Pattern: getters['searchText'],
      PathRequired: false,
    }
    const data = await filesWebApi.getFiles(parameters)
    if (_.isArray(data?.Items)) {
      const files = getParsedFiles(data.Items)
      const folders = getParseFolders(data.Items)
      commit('setFolderList', folders)
      commit('setFileList', files)
    } else {
      commit('setFolderList', [])
      commit('setFileList', [])
    }
    if (types.pObject(data?.Quota)) {
      commit('setFilesQuota', data.Quota)
    }
    dispatch('changeLoadingStatus', false)
  },
  clearItemLists: ({ commit }) => {
    commit('setFolderList', [])
    commit('setFileList', [])
  },
  changeCurrentStorage: ({ commit }, storage) => {
    commit('setCurrentStorage', storage)
  },
  changeLoadingStatus: ({ commit }, status) => {
    commit('setLoadingStatus', status)
  },
  changeCurrentPaths: (
    { state, commit, getters, dispatch },
    { path, lastStorage = false }
  ) => {
    const currentPaths = getters['currentPaths']
    let index = currentPaths.findIndex((elem) => {
      return elem?.path === path?.path
    })
    commit('setCurrentPath', { path: path?.path })
    commit('changeCurrentPath', { index, path, lastStorage })
  },
  asyncRenameItem: async ({ state }, { file, itemName }) => {
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
  changeFileName: ({ commit }, fileName) => {
    commit('setFileName', fileName)
  },
  selectFile: ({ commit }, file) => {
    commit('setCurrentFile', file)
  },
  changeSelectStatus: ({ commit }, item) => {
    commit('setSelectStatus', item)
  },
  
  asyncDeleteItems: async ({ state, commit, getters, dispatch }, { items }) => {
    const currentStorage = getters['currentStorage']
    const currentPath = getters['currentPath']
    const parameters = {
      Type: currentStorage?.Type,
      Path: currentPath,
      Items: items,
    }
    return await filesWebApi.deleteItems(parameters)
  },

  changeItemsLists: ({ commit }, { items }) => {
    const files = getFiles(items)
    const folders = getFolders(items)
    if (folders.length) {
      commit('removeFolders', folders)
    }
    if (files.length) {
      commit('removeFiles', files)
    }
  },
  removeSelectedItems: ({ commit }, { items }) => {
    commit('removeSelectedItems', items)
  },
  changeDialogComponent: ({ commit }, dialogComponent) => {
    commit('setDialogComponent', dialogComponent)
  },
  addCopyItems: ({ commit }, { items }) => {
    commit('setCopyItems', items)
    commit('setItemsCopyStatus', { items, status: true })
  },
  removeCopiedFiles: ({ commit }) => {
    commit('setCopyItemsStatus', { status: false })
    commit('removeCopiedFiles')
  },
  copyItems: async ({ dispatch, getters }) => {
    const parameters = getters['getCopyMoveParameters']
    const result = await filesWebApi.copyMoveItems(parameters, 'Copy')
    if (result) {
      dispatch('removeCopiedFiles')
      dispatch('asyncGetFiles')
    }
  },
  moveItems: async ({ dispatch, getters }) => {
    const parameters = getters['getCopyMoveParameters']
    const result = await filesWebApi.copyMoveItems(parameters, 'Move')
    if (result) {
      dispatch('removeCopiedFiles')
      dispatch('asyncGetFiles')
    }
  },
  asyncCreateFolder: async ({ dispatch, getters }, { name }) => {
    const currentStorage = getters['currentStorage']
    const parameters = {
      Type: currentStorage.Type,
      Path: getters['currentPath'],
      FolderName: name,
    }
    return await filesWebApi.createFolder(parameters)
  },
  asyncCreateShareableLink: async ({ commit, getters }, { withPassword }) => {
    const currentFile = getters['currentFile']
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
      commit('setItemProperty', {
        item: currentFile,
        property: 'publicLink',
        value: `${getApiHost()}${result}`,
      })
      if (parameters.Password) {
        commit('setItemProperty', {
          item: currentFile,
          property: 'linkPassword',
          value: parameters.Password,
        })
      }
      return result
    }
    return result
  },
  asyncDeletePublicLink: async ({ commit, getters }) => {
    const currentFile = getters['currentFile']
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
    }
    const result = await filesWebApi.deletePublicLink(parameters)
    if (result) {
      commit('setItemProperty', {
        item: currentFile,
        property: 'publicLink',
        value: '',
      })
      commit('setItemProperty', {
        item: currentFile,
        property: 'linkPassword',
        value: '',
      })
    }
    return result
  },
  asyncUpdateShare: async ({ commit, getters }, parameters) => {
    const result = await filesWebApi.updateShare(parameters)
    if (result) {
      const currentFile = getters['currentFile']
      commit('setItemProperty', {
        item: currentFile,
        property: 'shares',
        value: parameters.Shares,
      })
      return true
    }
    return false
  },
  asyncGetHistory: async (
    { state, commit, getters, dispatch },
    { resourceType, resourceId, offset, limit }
  ) => {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
      Offset: offset,
      Limit: limit,
    }
    return filesWebApi.getHistory(parameters)
  },
  asyncClearHistory: async (
    { state, commit, getters, dispatch },
    { resourceType, resourceId }
  ) => {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
    }
    return filesWebApi.clearHistory(parameters)
  },
  addDownloadsFiles: ({ state, commit, getters, dispatch }, files) => {
    commit('setDownloadFiles', files)
  },
  removeUploadedFiles: ({ commit }) => {
    commit('removeUploadedFiles')
  },
  removeSelectedUploadedFiles: ({ commit }, files) => {
    commit('removeSelectedUploadedFiles', files)
  },
  changeUploadingStatus: ({ commit }, { file, status }) => {
    commit('setItemProperty', {
      item: file,
      property: 'isUploading',
      value: status,
    })
  },
  changeFileUploadProgress: ({ commit }, { item, value }) => {
    commit('setFileUploadProgress', { item, value })
  },
  changeItemProperty: ({ commit }, { item, property, value }) => {
    commit('setItemProperty', { item, property, value })
  },
  asyncDownloadFile: async ({ getters }) => {
    const file = getters['currentFile']
    await filesWebApi.downloadFile(file)
  },
  asyncLeaveShare: async ({ getters, dispatch }) => {
    const selectedItems = getters['selectedFiles']
    const currentStorage = getters['currentStorage']
    const currentPath = getters['currentPath']

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
      const currentFile = getters['currentFile']
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
  changeCurrentHeader: ({ commit }, headerName) => {
    commit('setCurrentHeader', headerName)
  },
  changeSearchText: ({ commit }, text) => {
    commit('setSearchText', text)
  },
  getContactSuggestions: async ({}, params) => {
    return await  filesWebApi.getContactSuggestions(params)
  },
  asyncUpdateExtendedProps: async ({}, { type, path, name, paranoidKey }) => {
    const parameters = {
      Type: type,
      Path: path,
      Name: name,
      ExtendedProps: {}
    }
    parameters.ExtendedProps[paranoidKey.key] = paranoidKey.value
    return await filesWebApi.updateExtendedProps(parameters)
  },
  asyncGetExtendedPropsShares: async ({}, params) => {
    const result = await filesWebApi.getExtendedProps(params)
    if (_.isArray(result?.Shares)) {
      return result?.Shares
    }
    return false
  }
}

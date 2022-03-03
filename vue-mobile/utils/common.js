import types from 'src/utils/types'
import store from 'src/store'
import { getApiHost } from 'src/api/helpers'

import { fileFormats } from './formats'


const getFormatFile = (name) => {
  return name.split('.')[name.split('.').length - 1]
}

const isImg = (name) => {
  const formatFile = getFormatFile(name)
  return fileFormats.image.find((format) => {
    return format === formatFile.toLowerCase()
  })
}
const isCopied = (hash) => {
  const copiedFiles = store.getters['filesmobile/copiedFiles']
  const index = copiedFiles.findIndex((file) => file.hash === hash)
  return !!(index + 1)
}

const getPublicLink = (link) => {
  return link ? getApiHost() + link : ''
}

const parseFile = (file) => {
  return {
    loading: false,
    content: types.pString(file.Content),
    size: types.pInt(file.Size),
    file: file,
    hash: types.pString(file.Hash),
    name: types.pString(file.Name),
    type: types.pString(file.Type),
    lastModified: types.pInt(file.LastModified),
    owner: types.pString(file.Owner),
    fullPath: types.pString(file.FullPath),
    path: types.pString(file.Path),
    isFolder: types.pBool(file.IsFolder),
    shares: types.pArray(file?.ExtendedProps?.Shares),
    publicLink: getPublicLink(
      types.pString(file?.ExtendedProps?.PublicLink)
    ),
    linkPassword: '',
    downloadUrl: types.pString(file?.Actions?.download?.url),
    eitUrl: types.pString(file?.Actions?.edit?.url),
    viewUrl: types.pString(file?.Actions?.view?.url),
    decryptViewUrl: '',
    openUrl: types.pString(file?.Actions?.open?.url),
    paranoidKey: types.pString(file?.ExtendedProps?.ParanoidKey),
    initializationVector: types.pString(
      file?.ExtendedProps?.InitializationVector
    ),
    thumbnailUrl: types.pString(file?.ThumbnailUrl),
    contentType: types.pString(file.ContentType),
    id: types.pString(file?.Id),
    cancelToken: null,
    downloading: false,
    percentDownloading: 0,
    isSelected: false,
    isCopied: isCopied(types.pString(file.Hash)),
    isImg: isImg(types.pString(file.Name)),
    isArchive: !!file?.Actions?.list,
    sharedWithMeAccess: types.pInt(file?.ExtendedProps?.SharedWithMeAccess),
  }
}

export const parseUploadedFile = (file, path, storage) => {
  return {
    path: path,
    storage: storage,
    file: file,
    name: getShortName(file.name, 40),
    size: file.size,
    isUploading: true,
  }
}

export const getParsedFiles = (items) => {
  const files = []
  items.forEach((file) => {
    if (!file.IsFolder) {
      files.push(parseFile(file))
    }
  })
  return files
}
export const getParseFolders = (items) => {
  const folders = []
  items.forEach((file) => {
    if (file.IsFolder) {
      folders.push(parseFile(file))
    }
  })
  return folders
}
export const getFiles = (items) => {
  const files = []
  items.forEach((file) => {
    if (!file.isFolder) {
      files.push(file)
    }
  })
  return files
}
export const getFolders = (items) => {
  const folders = []
  items.forEach((file) => {
    if (file.isFolder) {
      folders.push(file)
    }
  })
  return folders
}
export const getShortName = (name, length) => {
  if (name.length > length) {
    return name.substr(0, length - 2)
  }
  return name
}
export const getFilteredItems = (items, key) => {
  return items.filter((item) => {
    if (item[key]) {
      return item
    }
  })
}
export const getParametersForShare = (items, file) => {
  const shares = items.map((item) => {
    return {
      PublicId: item.email,
      Access: item.status,
    }
  })
  return {
    Storage: file.type,
    Path: file.path,
    Id: file.name,
    Shares: shares,
    IsDir: file.isFolder,
  }
}

export const getPreviewIconName = (file) => {
  if (file.paranoidKey) return 'FileLockIcon'

  const name = file.name
  const format = getFormatFile(name)
  if (!format) return 'FileIcon'
  for (let type in fileFormats) {
    const index = fileFormats[type].findIndex(
      (currentFormat) => currentFormat === format.toLowerCase()
    )
    if (index + 1) {
      switch (type) {
        case 'media':
          return 'FileMediaIcon'
        case 'text':
          return 'FileTextIcon'
        case 'archive':
          return 'FileArchiveIcon'
        case 'image':
          return 'FileImageIcon'
        case 'link':
          return 'FileLinkIcon'
        case 'pdf':
          return 'FilePdfIcon'
        default:
          return 'FileIcon'
      }
    }
  }
  return 'FileIcon'
}

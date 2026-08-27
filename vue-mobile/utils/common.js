import types from 'src/utils/types'
import { getApiHost } from 'src/api/helpers'
import { fileFormats } from './formats'
import { STORAGE_ICON_NAMES, STORAGE_TYPES } from '../enums'

export const getStorageIconName = (storageType) => {
  const key = (storageType || '').toLowerCase()
  return STORAGE_ICON_NAMES[key] || 'Personal'
}

const getFormatFile = (name) => {
  return name.split('.')[name.split('.').length - 1]
}

export const getPreviewIconName = (file) => {
  if (file.paranoidKey) return 'FileLockIcon'

  if (file.isLink) {
    const linkType = (file.linkType || '').toLowerCase()
    if (linkType === 'oembeded') {
      return 'FileMediaIcon'
    }
    return 'FileLinkIcon'
  }

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

/**
 * Builds a displayable thumbnail URL. External shortcut thumbs are absolute;
 * server thumbs are relative to the API host.
 */
export const resolveThumbnailUrl = (thumbnailUrl) => {
  const url = types.pString(thumbnailUrl)
  if (!url) {
    return ''
  }
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    return url
  }
  return getApiHost() + url
}

/**
 * Opens an external shortcut URL in a new browser tab.
 */
export const openExternalLink = (url) => {
  const link = types.pString(url)
  if (!link) {
    return false
  }
  window.open(link, '_blank', 'noopener,noreferrer')
  return true
}

/**
 * Maps CheckUrl API result to create-link payload fields (desktop prepareLinkData).
 */
export const prepareLinkData = (data, linkUrl) => {
  return {
    isLink: true,
    linkType: types.pString(data?.LinkType),
    linkUrl: types.pString(linkUrl),
    name: types.pString(data?.Name),
    size: types.pInt(data?.Size),
    thumbnailUrl: types.pString(data?.Thumb),
  }
}

export const getLinkDisplayHost = (url) => {
  try {
    return new URL(types.pString(url)).hostname || ''
  } catch (e) {
    return ''
  }
}

const isImg = (name) => {
  const formatFile = getFormatFile(name)
  return fileFormats.image.find((format) => {
    return format === formatFile.toLowerCase()
  })
}
const isCopied = () => {
  return false
}

const getPublicLink = (link) => {
  return link ? getApiHost() + link : ''
}

const parseFile = (file) => {
  const isLink = !!file.IsLink
  const linkUrl = isLink
    ? types.pString(file.LinkUrl) || types.pString(file?.Actions?.open?.url)
    : ''
  const linkType = isLink ? types.pString(file.LinkType) : ''
  const name = types.pString(file.Name)
  const paranoidKey = types.pString(file?.ExtendedProps?.ParanoidKey)
  const parsed = {
    loading: false,
    content: types.pString(file.Content),
    size: types.pInt(file.Size),
    file: file,
    hash: types.pString(file.Hash),
    name,
    type: types.pString(file.Type),
    lastModified: types.pInt(file.LastModified),
    owner: types.pString(file.Owner),
    fullPath: types.pString(file.FullPath),
    path: types.pString(file.Path),
    isFolder: types.pBool(file.IsFolder),
    isLink,
    linkUrl,
    linkType,
    oembedHtml: isLink ? types.pString(file.OembedHtml) : '',
    shares: types.pArray(file?.ExtendedProps?.Shares),
    publicLink: getPublicLink(
      types.pString(file?.ExtendedProps?.PublicLink)
    ),
    linkPassword: '',
    downloadUrl: types.pString(file?.Actions?.download?.url),
    eitUrl: types.pString(file?.Actions?.edit?.url),
    viewUrl: types.pString(file?.Actions?.view?.url),
    decryptViewUrl: '',
    openUrl: types.pString(file?.Actions?.open?.url) || linkUrl,
    paranoidKey,
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
    isCopied: isCopied(),
    isImg: !isLink && isImg(name),
    isArchive: !!file?.Actions?.list,
    sharedWithMeAccess: types.pInt(file?.ExtendedProps?.SharedWithMeAccess),
    favorite: types.pBool(file.IsFavorite),
    trashOriginalPath: types.pString(file?.ExtendedProps?.TrashOriginalPath),
    decryptionProgress: false,
    iconName: '',
  }
  parsed.iconName = file.IsFolder
    ? 'Folder'
    : getPreviewIconName(parsed)
  return parsed
}

/** Exported for unit tests. */
export const parseFileItem = parseFile

export const getItemStorageType = (item, currentStorageType) => {
  if (currentStorageType === STORAGE_TYPES.FAVORITES && item?.type) {
    return item.type
  }
  return currentStorageType
}

export const STORAGES_THAT_SUPPORT_TRASH = [
  STORAGE_TYPES.PERSONAL,
  STORAGE_TYPES.SHARED,
  STORAGE_TYPES.CORPORATE,
  STORAGE_TYPES.ENCRYPTED,
]

export const isSharedWithOthers = (item) => {
  return Array.isArray(item?.shares) && item.shares.length > 0
}

export const resolveDeleteStorageType = (currentStorageType, item) => {
  if (
    (currentStorageType === STORAGE_TYPES.FAVORITES || currentStorageType === STORAGE_TYPES.TRASH)
    && item?.type
  ) {
    return item.type
  }
  return currentStorageType
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
  if (name && name.length > length) {
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
    if (item.isGroup) {
      return {
        PublicId: item.email,
        Access: item.status,
        IsAll: item.isAll,
        IsGroup:true,
        GroupId: item.groupId
      }
    } else {
      return {
        PublicId: item.email,
        Access: item.status,
      }
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

export const validateFileOrFolderName = (sName) => {
  sName = ('' + sName).trim();
	return '' !== sName && !/["\/\\*?<>|:]/.test(sName);
}

export const formatHintText = (text) => {
  if (!text) {
    return ''
  }

  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

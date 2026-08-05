import { STORAGE_TYPES } from '../enums'

export function normalizeRoutePath(path) {
  let segments = []

  if (Array.isArray(path)) {
    segments = path
  } else if (typeof path === 'string' && path.length) {
    segments = path.split('/')
  }

  return segments
    .map((segment) => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .filter(Boolean)
}

export function pathSegmentsToApiPath(segments) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return ''
  }

  return '/' + segments.join('/')
}

/**
 * Trash is a virtual storage; backend remaps Type=trash + Path=X to personal + /.trash + X.
 * API items still expose physical Path/FullPath under /.trash — strip that prefix for routes.
 */
export function toVirtualTrashPath(path) {
  if (!path || typeof path !== 'string') {
    return ''
  }

  return path.replace(/^\/\.trash(?=\/|$)/, '') || ''
}

/**
 * Build a files module route. For trash storage, physical /.trash is stripped from the path.
 */
export function buildFilesItemRoute(storageId, path, fileId) {
  const routePath = storageId === 'trash' ? toVirtualTrashPath(path) : (path || '')

  if (fileId) {
    return `/files/${storageId}${routePath}/${fileId}`
  }

  return `/files/${storageId}${routePath}/`
}

/**
 * Route storage for an item.
 * - Files in favorites stay under favorites (view/back must not leave the virtual list).
 * - Folders in favorites open in their real storage (favorites has no nested folders).
 * - Trash keeps the trash namespace for both files and folders.
 */
export function getRouteStorageId(currentStorageType, item, { isFolder = false } = {}) {
  if (currentStorageType === STORAGE_TYPES.TRASH) {
    return STORAGE_TYPES.TRASH
  }

  if (currentStorageType === STORAGE_TYPES.FAVORITES) {
    if (isFolder) {
      return item?.type || currentStorageType
    }
    return STORAGE_TYPES.FAVORITES
  }

  return item?.type || currentStorageType
}

export function getRoutePathForFile(currentStorageType, file, currentPathString = '') {
  if (currentStorageType === STORAGE_TYPES.FAVORITES) {
    return currentPathString || ''
  }

  if (currentStorageType === STORAGE_TYPES.TRASH) {
    return toVirtualTrashPath(file?.path || currentPathString || '')
  }

  return file?.path || currentPathString || ''
}

export function getRoutePathForFolder(currentStorageType, folder, currentPathString = '') {
  // Favorited folders live in a real storage — open that location.
  if (currentStorageType === STORAGE_TYPES.FAVORITES) {
    return folder?.fullPath || folder?.path || ''
  }

  if (currentStorageType === STORAGE_TYPES.TRASH) {
    return toVirtualTrashPath(folder?.fullPath || folder?.path || '')
  }

  return folder?.fullPath || folder?.path || currentPathString || ''
}

export function buildItemRouteFromContext(currentStorageType, item, {
  currentPathString = '',
  fileId = null,
  isFolder = false,
} = {}) {
  const storageId = getRouteStorageId(currentStorageType, item, { isFolder })
  const path = isFolder
    ? getRoutePathForFolder(currentStorageType, item, currentPathString)
    : getRoutePathForFile(currentStorageType, item, currentPathString)

  return buildFilesItemRoute(storageId, path, fileId)
}

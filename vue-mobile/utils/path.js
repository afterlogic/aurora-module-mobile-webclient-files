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

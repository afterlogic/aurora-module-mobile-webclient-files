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

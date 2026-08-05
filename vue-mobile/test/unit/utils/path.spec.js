import { describe, expect, it } from 'vitest'
import {
  normalizeRoutePath,
  pathSegmentsToApiPath,
  toVirtualTrashPath,
  buildFilesItemRoute,
  getRouteStorageId,
  getRoutePathForFile,
  buildItemRouteFromContext,
} from 'utils/path.js'
import { STORAGE_TYPES } from '../../../enums.js'

describe('path utils', () => {
  describe('normalizeRoutePath', () => {
    it('splits and decodes string paths', () => {
      expect(normalizeRoutePath('a/b%20c')).toEqual(['a', 'b c'])
    })

    it('keeps array segments and drops empties', () => {
      expect(normalizeRoutePath(['', 'docs', 'file.txt'])).toEqual(['docs', 'file.txt'])
    })

    it('returns empty list for empty input', () => {
      expect(normalizeRoutePath('')).toEqual([])
      expect(normalizeRoutePath(null)).toEqual([])
    })
  })

  describe('pathSegmentsToApiPath', () => {
    it('joins segments with leading slash', () => {
      expect(pathSegmentsToApiPath(['docs', 'a.txt'])).toBe('/docs/a.txt')
    })

    it('returns empty string for empty segments', () => {
      expect(pathSegmentsToApiPath([])).toBe('')
      expect(pathSegmentsToApiPath(null)).toBe('')
    })
  })

  describe('toVirtualTrashPath', () => {
    it('strips physical /.trash prefix', () => {
      expect(toVirtualTrashPath('/.trash')).toBe('')
      expect(toVirtualTrashPath('/.trash/Folder')).toBe('/Folder')
      expect(toVirtualTrashPath('/.trash/Folder/file.txt')).toBe('/Folder/file.txt')
    })

    it('leaves non-trash paths unchanged', () => {
      expect(toVirtualTrashPath('/docs')).toBe('/docs')
      expect(toVirtualTrashPath('')).toBe('')
      expect(toVirtualTrashPath(null)).toBe('')
    })
  })

  describe('buildFilesItemRoute', () => {
    it('opens trash file without duplicating /.trash in the route', () => {
      expect(buildFilesItemRoute('trash', '/.trash', 'photo.jpg')).toBe('/files/trash/photo.jpg')
      expect(buildFilesItemRoute('trash', '/.trash/Docs', 'a.txt')).toBe('/files/trash/Docs/a.txt')
    })

    it('opens trash folder without duplicating /.trash in the route', () => {
      expect(buildFilesItemRoute('trash', '/.trash/Docs')).toBe('/files/trash/Docs/')
    })

    it('keeps physical path for non-trash storages', () => {
      expect(buildFilesItemRoute('personal', '/docs', 'a.txt')).toBe('/files/personal/docs/a.txt')
      expect(buildFilesItemRoute('personal', '/docs')).toBe('/files/personal/docs/')
    })
  })

  describe('getRouteStorageId', () => {
    it('keeps favorites for files, but uses item type for folders', () => {
      expect(getRouteStorageId(STORAGE_TYPES.FAVORITES, { type: 'personal' })).toBe('favorites')
      expect(getRouteStorageId(STORAGE_TYPES.FAVORITES, { type: 'personal' }, { isFolder: true })).toBe('personal')
      expect(getRouteStorageId(STORAGE_TYPES.TRASH, { type: 'personal' })).toBe('trash')
      expect(getRouteStorageId(STORAGE_TYPES.PERSONAL, { type: 'corporate' })).toBe('corporate')
      expect(getRouteStorageId(STORAGE_TYPES.PERSONAL, null)).toBe('personal')
    })
  })

  describe('getRoutePathForFile', () => {
    it('ignores physical path when browsing favorites', () => {
      expect(getRoutePathForFile(STORAGE_TYPES.FAVORITES, { path: '/Docs/sub' }, '')).toBe('')
    })

    it('uses virtual trash path for trash storage', () => {
      expect(getRoutePathForFile(STORAGE_TYPES.TRASH, { path: '/.trash/Docs' }, '')).toBe('/Docs')
    })
  })

  describe('buildItemRouteFromContext', () => {
    it('opens favorite file without switching to the original storage path', () => {
      expect(buildItemRouteFromContext(STORAGE_TYPES.FAVORITES, {
        type: 'shared',
        path: '/SharedFolder',
        id: 'report.pdf',
      }, {
        fileId: 'report.pdf',
      })).toBe('/files/favorites/report.pdf')
    })

    it('opens favorited folder in its real storage path', () => {
      expect(buildItemRouteFromContext(STORAGE_TYPES.FAVORITES, {
        type: 'personal',
        fullPath: '/Docs/Reports',
        path: '/Docs',
      }, {
        isFolder: true,
      })).toBe('/files/personal/Docs/Reports/')
    })

    it('opens trash favorite file in favorites route namespace', () => {
      expect(buildItemRouteFromContext(STORAGE_TYPES.FAVORITES, {
        type: 'personal',
        path: '/.trash/old.txt',
        id: 'old.txt',
      }, {
        fileId: 'old.txt',
      })).toBe('/files/favorites/old.txt')
    })
  })
})

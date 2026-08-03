import { describe, expect, it } from 'vitest'
import {
  normalizeRoutePath,
  pathSegmentsToApiPath,
  toVirtualTrashPath,
  buildFilesItemRoute,
} from 'utils/path.js'

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
})

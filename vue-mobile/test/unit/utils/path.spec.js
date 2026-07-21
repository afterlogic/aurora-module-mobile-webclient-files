import { describe, expect, it } from 'vitest'
import { normalizeRoutePath, pathSegmentsToApiPath } from 'utils/path.js'

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
})

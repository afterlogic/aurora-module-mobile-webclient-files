import { describe, expect, it } from 'vitest'
import {
  getShortName,
  validateFileOrFolderName,
  formatHintText,
  getFiles,
  getFolders,
  resolveDeleteStorageType,
  isSharedWithOthers,
} from 'utils/common.js'
import { STORAGE_TYPES } from '../../../enums.js'

describe('files common utils (pure helpers)', () => {
  describe('getShortName', () => {
    it('truncates long names', () => {
      expect(getShortName('abcdefghij', 6)).toBe('abcd')
      expect(getShortName('short', 10)).toBe('short')
    })
  })

  describe('validateFileOrFolderName', () => {
    it('rejects empty and forbidden characters', () => {
      expect(validateFileOrFolderName('')).toBe(false)
      expect(validateFileOrFolderName('a/b')).toBe(false)
      expect(validateFileOrFolderName('ok-name.txt')).toBe(true)
    })
  })

  describe('formatHintText', () => {
    it('strips br/nbsp and collapses whitespace', () => {
      expect(formatHintText('a<br>b&nbsp;c')).toBe('a b c')
      expect(formatHintText('')).toBe('')
    })
  })

  describe('getFiles / getFolders', () => {
    const items = [
      { name: 'f', isFolder: false },
      { name: 'd', isFolder: true },
    ]

    it('splits files and folders by isFolder', () => {
      expect(getFiles(items).map((i) => i.name)).toEqual(['f'])
      expect(getFolders(items).map((i) => i.name)).toEqual(['d'])
    })
  })

  describe('resolveDeleteStorageType', () => {
    it('uses item type for favorites and trash', () => {
      expect(resolveDeleteStorageType(STORAGE_TYPES.TRASH, { type: 'personal' })).toBe('personal')
      expect(resolveDeleteStorageType(STORAGE_TYPES.FAVORITES, { type: 'corporate' })).toBe('corporate')
      expect(resolveDeleteStorageType(STORAGE_TYPES.PERSONAL, { type: 'corporate' })).toBe('personal')
    })
  })

  describe('isSharedWithOthers', () => {
    it('detects non-empty shares', () => {
      expect(isSharedWithOthers({ shares: [] })).toBe(false)
      expect(isSharedWithOthers({ shares: [{ PublicId: 'a' }] })).toBe(true)
    })
  })
})

import { describe, expect, it } from 'vitest'
import {
  getShortName,
  validateFileOrFolderName,
  formatHintText,
  getFiles,
  getFolders,
} from 'utils/common.js'

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
})

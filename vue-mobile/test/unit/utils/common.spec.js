import { describe, expect, it } from 'vitest'
import {
  getShortName,
  validateFileOrFolderName,
  formatHintText,
  getFiles,
  getFolders,
  resolveDeleteStorageType,
  isSharedWithOthers,
  getPreviewIconName,
  prepareLinkData,
  resolveThumbnailUrl,
  getLinkDisplayHost,
  parseFileItem,
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

  describe('shortcut / link helpers', () => {
    it('parseFileItem maps IsLink fields and openUrl', () => {
      const parsed = parseFileItem({
        Name: 'Demo.url',
        Size: 42,
        IsLink: true,
        LinkUrl: 'https://www.youtube.com/watch?v=abc',
        LinkType: 'oembeded',
        ThumbnailUrl: 'https://img.youtube.com/vi/abc/hqdefault.jpg',
        Actions: {
          open: { url: 'https://www.youtube.com/watch?v=abc' },
        },
      })
      expect(parsed.isLink).toBe(true)
      expect(parsed.linkUrl).toBe('https://www.youtube.com/watch?v=abc')
      expect(parsed.linkType).toBe('oembeded')
      expect(parsed.openUrl).toBe('https://www.youtube.com/watch?v=abc')
      expect(parsed.isImg).toBe(false)
      expect(parsed.iconName).toBe('FileMediaIcon')
    })

    it('getPreviewIconName uses FileLinkIcon for plain shortcuts', () => {
      expect(getPreviewIconName({ isLink: true, linkType: '', name: 'x.url' })).toBe('FileLinkIcon')
      expect(getPreviewIconName({ name: 'page.html' })).toBe('FileLinkIcon')
      expect(getPreviewIconName({ name: 'note.url' })).toBe('FileLinkIcon')
    })

    it('prepareLinkData and thumbnail/host helpers', () => {
      expect(prepareLinkData({ Name: 'Title', Size: 1, LinkType: 'oembeded', Thumb: 'https://t' }, 'https://u'))
        .toEqual({
          isLink: true,
          linkType: 'oembeded',
          linkUrl: 'https://u',
          name: 'Title',
          size: 1,
          thumbnailUrl: 'https://t',
        })
      expect(resolveThumbnailUrl('https://cdn/x.jpg')).toBe('https://cdn/x.jpg')
      expect(resolveThumbnailUrl('/thumb/1')).toBe('https://example.test/thumb/1')
      expect(getLinkDisplayHost('https://www.youtube.com/watch?v=1')).toBe('www.youtube.com')
    })
  })
})

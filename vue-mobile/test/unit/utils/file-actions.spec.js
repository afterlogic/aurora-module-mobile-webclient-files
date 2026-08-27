import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fileActions, shouldShowDeleteConfirm } from 'utils/file-actions.js'
import { SHARING_LEVELS } from '../../../enums.js'
import { getFilesSettings } from '../../../settings.js'

vi.mock('../../../settings.js', () => ({
  getFilesSettings: vi.fn(),
}))

describe('fileActions.isShowAction', () => {
  const show = (name, items, storage, path) =>
    fileActions[name].isShowAction(name, items, storage, path)

  const file = { isFolder: false, sharedWithMeAccess: SHARING_LEVELS.NOACCESS }

  beforeEach(() => {
    getFilesSettings.mockReturnValue({ allowFavorites: true, allowTrash: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('hides copy/rename/delete inside zip path', () => {
    expect(show('copy', [file], 'personal', '/a.zip')).toBe(false)
    expect(show('rename', [file], 'personal', '/a.zip')).toBe(false)
    expect(show('delete', [file], 'personal', '/a.zip')).toBe(false)
  })

  it('hides createShareableLink and delete on shared storage', () => {
    expect(show('createShareableLink', [file], 'shared', '/doc.txt')).toBe(false)
    expect(show('delete', [file], 'shared', '/doc.txt')).toBe(false)
  })

  it('hides download for folders', () => {
    expect(show('download', [{ ...file, isFolder: true }], 'personal', '/dir')).toBe(false)
    expect(show('download', [file], 'personal', '/f.txt')).toBe(true)
  })

  it('shows openLink only for shortcuts and hides download', () => {
    const link = { ...file, isLink: true }
    expect(show('openLink', [file], 'personal', '/f.txt')).toBe(false)
    expect(show('openLink', [link], 'personal', '/demo.url')).toBe(true)
    expect(show('download', [link], 'personal', '/demo.url')).toBe(false)
  })

  it('shareLeave only when item has shared access', () => {
    expect(show('shareLeave', [file], 'personal', '/f.txt')).toBe(false)
    expect(
      show(
        'shareLeave',
        [{ ...file, sharedWithMeAccess: SHARING_LEVELS.READ }],
        'personal',
        '/f.txt'
      )
    ).toBe(true)
  })

  it('shows restore only in trash', () => {
    expect(show('restore', [file], 'personal', '/f.txt')).toBe(false)
    expect(show('restore', [file], 'trash', '/f.txt')).toBe(true)
  })

  it('hides copy/rename/share actions in trash', () => {
    expect(show('copy', [file], 'trash', '/f.txt')).toBe(false)
    expect(show('rename', [file], 'trash', '/f.txt')).toBe(false)
    expect(show('createShareableLink', [file], 'trash', '/f.txt')).toBe(false)
    expect(show('shareWithTeammates', [file], 'trash', '/f.txt')).toBe(false)
    expect(show('delete', [file], 'trash', '/f.txt')).toBe(true)
  })
})

describe('shouldShowDeleteConfirm', () => {
  beforeEach(() => {
    getFilesSettings.mockReturnValue({ allowTrash: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('does not confirm soft-delete from regular storage', () => {
    expect(shouldShowDeleteConfirm('personal')).toBe(false)
    expect(shouldShowDeleteConfirm('corporate')).toBe(false)
    expect(shouldShowDeleteConfirm('favorites')).toBe(false)
  })

  it('confirms permanent delete from trash', () => {
    expect(shouldShowDeleteConfirm('trash')).toBe(true)
  })

  it('confirms delete when trash is disabled', () => {
    getFilesSettings.mockReturnValue({ allowTrash: false })
    expect(shouldShowDeleteConfirm('personal')).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { fileActions } from 'utils/file-actions.js'
import { SHARING_LEVELS } from '../../../enums.js'

describe('fileActions.isShowAction', () => {
  const show = (name, items, storage, path) =>
    fileActions[name].isShowAction(name, items, storage, path)

  const file = { isFolder: false, sharedWithMeAccess: SHARING_LEVELS.NOACCESS }

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
})

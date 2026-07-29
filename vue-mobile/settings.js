import types from 'src/utils/types'

class FilesSettings {
  constructor (appData) {
    const filesData = types.pObject(appData.Files)
    this.allowFavorites = types.pBool(filesData.AllowFavorites, true)
    this.allowTrash = types.pBool(filesData.AllowTrash, true)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new FilesSettings(appData)
  },
}

export const getFilesSettings = () => {
  return settings
}

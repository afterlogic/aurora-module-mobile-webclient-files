// import _ from 'lodash'
// import typesUtils from 'src/utils/types'

class FilesSettings {
  constructor (appData) {
    // const filesData = typesUtils.pObject(appData.Files)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new FilesSettings(appData)
  },
}

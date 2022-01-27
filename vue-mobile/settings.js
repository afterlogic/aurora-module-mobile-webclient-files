import _ from 'lodash'
import typesUtils from 'src/utils/types'

class FilesSettings {
  constructor (appData) {
    const filesData = typesUtils.pObject(appData.Files)
    console.log('filesData', filesData)
    const corporateFilesData = typesUtils.pObject(appData.CorporateFiles)
    console.log('corporateFilesData', corporateFilesData)
    this.enableUploadSizeLimit = typesUtils.pBool(filesData.EnableUploadSizeLimit)
    this.uploadSizeLimitMb = typesUtils.pNonNegativeInt(filesData.UploadSizeLimitMb)
    this.userSpaceLimitMb = typesUtils.pNonNegativeInt(filesData.UserSpaceLimitMb)
    this.tenantSpaceLimitMb = typesUtils.pNonNegativeInt(filesData.TenantSpaceLimitMb)
    this.showCorporateFilesAdminSection = true
    this.corporateSpaceLimitMb = typesUtils.pNonNegativeInt(corporateFilesData.SpaceLimitMb)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new FilesSettings(appData)
  },

  getFilesSettings () {
    return {
      enableUploadSizeLimit: settings.enableUploadSizeLimit,
      uploadSizeLimitMb: settings.uploadSizeLimitMb,
      tenantSpaceLimitMb: settings.tenantSpaceLimitMb,
      userSpaceLimitMb: settings.userSpaceLimitMb,
      corporateSpaceLimitMb: settings.corporateSpaceLimitMb,
    }
  },
}

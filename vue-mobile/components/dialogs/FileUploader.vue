<template>
  <div />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueCookies from 'vue-cookies'

import { getApiHost } from 'src/api/helpers'
import { parseUploadedFile } from 'src/utils/files/utils'

export default {
  name: 'FileUploader',
  props: {
    dialog: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters('filesmobile', [
      'currentStorage',
      'currentPath',
      'dialogComponent',
    ]),
  },
  watch: {
    dialogComponent(val) {
      if (val.component === 'FileUploader') {
        const methods = {
          factory: this.addedFiles,
          added: this.onFileAdded,
          uploaded: this.showReport,
          finish: this.finishUpload,
        }
        this.$root.uploadFiles(methods)
      }
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'addDownloadsFiles',
      'removeUploadedFiles',
      'asyncGetFiles',
    ]),
    addedFiles() {
      if (this.currentStorage.Type !== 'encrypted') {
        let url = getApiHost() + '/?/Api/'
        let sAuthToken = VueCookies.get('AuthToken')
        let headers = []
        if (sAuthToken) {
          headers.push({ name: 'Authorization', value: 'Bearer ' + sAuthToken })
        }
        return {
          url,
          method: 'POST',
          headers,
          fieldName: 'jua-uploader',
          formFields: [
            { name: 'jua-post-type', value: 'ajax' },
            { name: 'Module', value: 'Files' },
            { name: 'Method', value: 'UploadFile' },
            {
              name: 'Parameters',
              value: JSON.stringify({
                Type: this.currentStorage.Type,
                SubPath: '',
                Path: this.currentPath,
                Overwrite: false,
              }),
            },
          ],
        }
      }
    },
    onFileAdded(files) {
      const parsedFiles = files.map((file) => {
        return parseUploadedFile(
          file,
          this.currentPath,
          this.currentStorage.Type
        )
      })
      this.addDownloadsFiles(parsedFiles)
    },
    showReport(file) {},
    async finishUpload() {
      await this.asyncGetFiles()
      this.removeUploadedFiles()
    },
  },
}
</script>

<style scoped></style>

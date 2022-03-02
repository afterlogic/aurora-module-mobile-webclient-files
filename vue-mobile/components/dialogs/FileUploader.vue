<template>
  <div />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueCookies from 'vue-cookies'

import { getApiHost } from 'src/api/helpers'
import { parseUploadedFile } from '../../utils/common'
import eventBus from 'src/event-bus'

export default {
  name: 'FileUploader',
  props: {
    dialog: { type: Boolean, default: false },
  },
  created() {
    eventBus.$on('onUploadFiles', this.onUploadFiles)
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
        const params = {
          store: this.$store,
          methods,
          storage: this.currentStorage.Type,
          getParentComponent: this.$root._getParentComponent
        }
        eventBus.$emit('OnFileAdded', params)

      }
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'addDownloadsFiles',
      'removeUploadedFiles',
      'asyncGetFiles',
    ]),
    onUploadFiles(methods) {
      this.$root.uploadFiles(methods)
    },
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
    onFileAdded(files, uploader) {
      const parsedFiles = files.map((file) => {
        return parseUploadedFile(
          file,
          this.currentPath,
          this.currentStorage.Type
        )
      })
      this.addDownloadsFiles(parsedFiles)
      uploader.upload()
    },
    showReport(file) {},
    async finishUpload() {
      await this.asyncGetFiles()
      this.removeUploadedFiles()
    },
  },
  unmounted() {
    eventBus.$off('onUploadFiles', this.onUploadFiles)
  }
}
</script>

<style scoped></style>

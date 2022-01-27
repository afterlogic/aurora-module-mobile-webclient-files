<template>
  <q-uploader
    multiple
    style="max-height: initial; display: none"
    class="col full-height full-width"
    flat
    ref="uploader"
    :factory="addedFiles"
    @added="onFileAdded"
    @uploaded="showReport"
    @finish="finishUpload"
  />
</template>

<script>
export default {
  name: 'UploaderComponent',
  data() {
    return {
      factory: null,
      added: null,
      uploaded: null,
      finish: null,
    }
  },
  methods: {
    open(methods) {
      if (methods) {
        this.factory = methods.factory
        this.added = methods.added
        this.uploaded = methods.uploaded
        this.finish = methods.finish
        this.$refs.uploader.removeQueuedFiles()
        this.$refs.uploader.removeUploadedFiles()
        this.$refs.uploader.pickFiles()
      }
    },
    addedFiles() {
      return this.factory()
    },
    onFileAdded(files) {
      this.added(files)
      this.$refs.uploader.upload()
    },
    showReport(file) {
      this.uploaded(file)
    },
    finishUpload() {
      this.finish()
    },
  },
}
</script>

<style scoped></style>

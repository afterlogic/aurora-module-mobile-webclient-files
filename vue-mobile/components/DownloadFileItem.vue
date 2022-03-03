<template>
  <q-item v-if="isShowFile" clickable>
    <q-item-section class="q-ml-lg" avatar>
      <file-item-icon :file="file" />
    </q-item-section>
    <q-item-section class="q-mr-sm">
      <q-item-label class="file__name">{{ file.name }}</q-item-label>
      <q-item-label class="file__info">{{ progressPercent }}%</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import FileItemIcon from './icons/FileItemIcon'

export default {
  name: 'DownloadFileItem',
  props: {
    file: { type: Object, default: null },
  },
  components: {
    FileItemIcon,
  },
  data() {
    return {
      progressPercent: 0,
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentPath', 'currentStorage']),
    isShowFile() {
      if (!this.file) return false
      return (
        this.file.path === this.currentPath &&
        this.file.storage === this.currentStorage.Type &&
        this.file.isUploading
      )
    },
  },
  mounted() {
    this.getProgressPercent()
  },
  methods: {
    ...mapActions('filesmobile', ['changeUploadingStatus']),
    getProgressPercent() {
      if (this.file) {
        if (this.file.file?.__progress !== 1) {
          this.progressPercent = Math.ceil(this.file.file.__progress * 100) || 0
          setTimeout(() => {
            if (this.progressPercent !== 100) {
              this.getProgressPercent()
            }
          }, 100)
        } else {
          this.changeUploadingStatus({ file: this.file, status: false })
        }
      }
    },
  },
}
</script>

<style scoped></style>

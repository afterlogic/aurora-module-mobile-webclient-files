<template>
  <main-layout title="File info">
    <q-scroll-area :thumb-style="{ width: '5px' }" class="file__info">
      <div v-if="currentFile">
        <div class="flex items-center justify-center">
          <div v-if="!currentFile.thumbnailUrl" class="file__preview q-my-xl">
            <file-item-icon
                v-if="!currentFile.thumbnailUrl"
                :file-name="currentFile.name"
                :height="64"
                :width="64"
            />
          </div>
          <div
              class="q-my-lg"
              style="height: 348px"
              v-if="currentFile.thumbnailUrl"
          >
            <div
                class="img-preview"
                :style="{
              background: `url(${filePreview}) no-repeat center`,
              'background-size': 'contain',
            }"
            />
          </div>
        </div>
        <div>
          <div class="q-mx-md">
            <input-form readonly :value="currentFile.name" label="File name" />
          </div>
          <div class="flex justify-between q-ma-md">
            <input-form readonly :value="fileSize" label="Size" />
            <input-form readonly :value="fileDate" label="Created" />
          </div>
          <div class="q-ma-md">
            <input-form readonly :value="filePatch" label="Location" />
          </div>
          <div class="q-ma-md">
            <input-form readonly :value="currentFile.owner" label="Owner" />
          </div>
        </div>
        <div style="height: 50px"/>
      </div>
    </q-scroll-area>
    <dialogs-list />
  </main-layout>
</template>
<script>
import { mapGetters } from 'vuex'

import date from 'src/utils/date'
import text from 'src/utils/text'
import { getApiHost } from 'src/api/helpers'

import DialogsList from '../components/DialogsList'
import MainLayout from 'src/layouts/MainLayout'
import FileItemIcon from '../components/icons/FileItemIcon'
import InputForm from '../components/common/InputForm'

export default {
  name: 'FileInfo',
  components: {
    MainLayout,
    FileItemIcon,
    InputForm,
    DialogsList,
  },
  mounted() {
    if (!this.currentFile) {
      this.$router.push('/files')
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentFile']),
    filePreview() {
      const api = getApiHost()
      return api + this.currentFile.viewUrl
    },
    filePatch() {
     return this.currentFile.path || '/'
    },
    fileDate() {
      return date.getDate(this.currentFile.lastModified)
    },
    fileSize() {
      return text.getFriendlySize(this.currentFile.size)
    },
  },
}
</script>

<style lang="scss" scoped>
.file {
  &__info {
    height: calc(100vh - 115px);
  }
  &__info .q-scrollarea__content {
    width: 100vw;
  }
}

.file__preview {
  margin-top: 60px;
  margin-bottom: 60px;
}
.img-preview {
  height: 348px;
  min-width: 348px;
}
</style>

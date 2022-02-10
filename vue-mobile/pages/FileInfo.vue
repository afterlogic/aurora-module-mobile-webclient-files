<template>
  <main-layout title="File info">
    <div class="file__info">
      <div class="flex items-center justify-center">
        <div v-if="!currentFile.thumbnailUrl" class="file__preview q-my-xl">
          <file-item-icon
            v-if="!currentFile.thumbnailUrl"
            :file-name="currentFile.name"
          />
        </div>
        <div
          class="q-my-md"
          style="height: 248px"
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
          <input-form readonly :value="currentFile.path" label="Location" />
        </div>
        <div class="q-ma-md">
          <input-form readonly :value="currentFile.owner" label="Owner" />
        </div>
      </div>
    </div>
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
  computed: {
    ...mapGetters('filesmobile', ['currentFile']),
    filePreview() {
      const api = getApiHost()
      return api + this.currentFile.viewUrl
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
.file__preview {
  margin-top: 60px;
  margin-bottom: 60px;
}
.img-preview {
  height: 248px;
  min-width: 248px;
}
</style>

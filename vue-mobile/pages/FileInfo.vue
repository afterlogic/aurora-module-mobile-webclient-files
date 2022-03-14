<template>
  <main-layout>
    <q-scroll-area :thumb-style="{ width: '5px' }" class="file__info">
      <div v-if="currentFile">
        <div class="flex items-center justify-center">
          <div
              class="file__preview full-width"
              style="height: 1em"
          >
            <q-linear-progress v-if="currentFile.decryptionProgress" indeterminate track-color="grey-1" color="primary"/>
          </div>
          <div
              v-if="(currentFile.paranoidKey || !currentFile.thumbnailUrl) &&
               !currentFile.decryptViewUrl"
              class="file__preview q-my-xl"
          >
            <file-item-icon
                v-if="currentFile.paranoidKey || !currentFile.thumbnailUrl"
                :file="currentFile"
                :height="64"
                :width="64"
            />
            <div
                v-if="isShowDecryptAction"
                class="text-primary q-mt-md view-action flex items-center justify-center"
                @click="onDecrypt"
            >
              <span>Show</span>
            </div>
          </div>
          <div
              class="q-my-lg"
              style="height: 100%; width: 100%"
              v-if="(currentFile.thumbnailUrl && !currentFile.paranoidKey) ||
               currentFile.decryptViewUrl"
          >
            <q-img
                :src="filePreview"
                :ratio="1"
                no-spinner
                fit="scale-down"
            />
          </div>
        </div>
        <div>
          <div class="q-mx-md">
            <input-form readonly :value="currentFile.name" label="File name" />
          </div>
          <div class="flex no-wrap justify-between q-ma-md">
            <input-form readonly :value="fileSize" label="Size" style="width:100%" />
            <div style="width:60px;"></div>
            <input-form readonly :value="fileDate" label="Created" style="width:100%" />
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
import eventBus from 'src/event-bus'

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
    isShowDecryptAction() {
      if (!this.currentFile) return ''
      return this.currentFile.paranoidKey && this.currentFile.thumbnailUrl
    },
    filePreview() {
      if (this.currentFile.decryptViewUrl){
        return this.currentFile.decryptViewUrl
      }
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
  watch: {
    currentFile(file) {
      if (!file) {
        this.$router.push('/files')
      }
    }
  },
  methods: {
    onDecrypt() {
      eventBus.$emit('CoreMobileWebclient::viewFile', {
        getParentComponent: this.$root._getParentComponent
      })
    },
  }
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
.view-action {
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;

  letter-spacing: 0.3px;
  text-decoration-line: underline;

}

.img-preview {
  height: 348px;
  max-width: 348px;
}
</style>

<template>
  <ShareWithMeInfoIcon v-if="currentFile?.sharedWithMeAccess" class="absolute" style="right: 0; position: fixed; z-index: 1"/>
  <q-scroll-area :thumb-style="{ width: '5px', 'z-index': 2 }" class="file-info__info">
    <div v-if="currentFile">
      <div class="flex items-center justify-center">
        <div
            class="file-info__preview full-width"
            style="height: 1em"
        >
          <q-linear-progress v-if="currentFile.decryptionProgress" indeterminate track-color="grey-1" color="primary"/>
        </div>
        <div
            v-if="(currentFile.paranoidKey || !currentFile.thumbnailUrl) &&
              !currentFile.decryptViewUrl"
            class="file-info__preview q-my-xl"
        >
          <FileItemIcon
              v-if="currentFile.paranoidKey || !currentFile.thumbnailUrl"
              :file="currentFile"
              :height="64"
              :width="64"
          />
          <div
              v-if="isShowDecryptAction"
              class="view-action text-primary q-mt-md flex items-center justify-center"
              @click="onDecrypt"
          >
            <span>Show</span>
          </div>
        </div>
        <div
            class="q-my-lg"
            style="height: 100%; width: 100%"
            v-if="(currentFile.thumbnailUrl && !currentFile.paranoidKey) || currentFile.decryptViewUrl"
        >
          <div style="display:flex; justify-content:center; align-items:center; min-height: 250px;">
            <img :src="filePreview" style="max-height: 400px; max-width: 100%;" />
          </div>
          <!--<q-img
              class="file-info__img"
              :src="filePreview"
              no-spinner
              fit="scale-down"
              style="max-height: 400px;max-width: 100%;min-height: 250px;"
          />-->
        </div>
      </div>
      <div>
        <div class="q-mx-md">
          <div class="flex" style="border-bottom: 1px solid #C6C6C6;">
            <div style="flex-grow: 1">
              <input-form :border="false" readonly :value="currentFile.name" label="File name" />
            </div>
            <div class="file__info flex items-end q-mb-xs">
              <EncryptedItemIcon v-if="currentFile.paranoidKey" class="file__info-icon_encrypted q-mx-xs"/>
              <SharedItemIcon v-if="isShared" width="14" height="14" class="file__info-icon_shared q-mx-xs"/>
              <LinkItemIcon v-if="currentFile.publicLink" class="file__info-icon_link q-mx-xs"/>
            </div>
          </div>
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
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import date from 'src/utils/date'
import text from 'src/utils/text'
import { getApiHost } from 'src/api/helpers'
import eventBus from 'src/event-bus'

import { SHARING_LEVELS } from '../enums'
import FileItemIcon from '../components/icons/FileItemIcon'
import InputForm from '../components/common/InputForm'
import EncryptedItemIcon from '../components/icons/item/EncryptedItemIcon'
import LinkItemIcon from '../components/icons/item/LinkItemIcon'
import SharedItemIcon from '../components/icons/item/SharedItemIcon'
import ShareWithMeInfoIcon from '../components/icons/ShareWithMeInfoIcon'

export default {
  name: 'FileInfo',

  components: {
    FileItemIcon,
    InputForm,
    EncryptedItemIcon,
    LinkItemIcon,
    SharedItemIcon,
    ShareWithMeInfoIcon
  },

  mounted() {
    this.getFile()
  },

  computed: {
    ...mapGetters('filesmobile', [
      'currentFile',
      'currentStorage',
      'fileList',
    ]),
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
    isShared() {
      return !!this.currentFile.shares.length || this.currentFile.sharedWithMeAccess === SHARING_LEVELS.RESHARE
    },
  },
  watch: {
    currentStorage(){
      this.getFile()
    },
    currentFile(file) {
      if (!file) {
        // this.$router.back()
      }
    }
  },
  methods: {
    ...mapActions('filesmobile', [
      'asyncGetFiles',
      'selectFile',
    ]),
    async getFile() {
      //restore data on page reload
      if (this.currentStorage) {
        if (this.fileList.length === 0) {
          await this.asyncGetFiles();
        }
        const fileName = this.$route.params.fileName
        const file = this.fileList.find((item) => item.name === fileName)
  
        if (file) {
          this.selectFile(file)
        }
      }
    },
    onDecrypt() {
      eventBus.$emit('CoreMobileWebclient::viewFile', {
        getParentComponent: this.$root._getParentComponent
      })
    },
  }
}
</script>

<style lang="scss">
.file-info {
  &__info {
    height: 100%;
  }
  &__info .q-scrollarea__content {
    width: 100%;
  }

}
.file {
  &__info-icon_encrypted,
  &__info-icon_shared,
  &__info-icon_link {
    fill: $secondary;
  }
}
.view-action {
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;

  letter-spacing: 0.3px;
  text-decoration-line: underline;
}
</style>

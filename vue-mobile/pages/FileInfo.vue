<template>
  <ShareWithMeInfoIcon v-if="currentFile?.sharedWithMeAccess" class="absolute" style="right: 0; position: fixed; z-index: 1"/>
  <AppListLoader v-if="currentFile?.decryptionProgress" initial class="fit" />
  <q-scroll-area
    v-else
    data-test-id="files-view"
    :thumb-style="{ width: '5px', 'z-index': 2 }"
    class="file-info__info fit"
  >
    <div v-if="currentFile">
      <div class="flex items-center justify-center">
        <div
            v-if="showIconPreview"
            class="file-info__preview q-my-xl"
        >
          <FileItemIcon
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
          <q-btn
              v-if="currentFile.isLink"
              data-test-id="files-view-open-link-btn"
              class="q-mt-md"
              color="primary"
              flat
              no-caps
              :label="$t('COREWEBCLIENT.ACTION_OPEN_LINK')"
              @click="openLink"
          />
        </div>
        <div
            class="q-my-lg"
            style="height: 100%; width: 100%"
            v-if="showImagePreview"
        >
          <div style="display:flex; justify-content:center; align-items:center; min-height: 250px;">
            <img :src="filePreview" style="max-height: 400px; max-width: 100%;" />
          </div>
          <div v-if="currentFile.isLink" class="flex justify-center">
            <q-btn
                data-test-id="files-view-open-link-btn"
                class="q-mt-md"
                color="primary"
                flat
                no-caps
                :label="$t('COREWEBCLIENT.ACTION_OPEN_LINK')"
                @click="openLink"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="q-mx-md">
          <div class="flex" style="border-bottom: 1px solid #C6C6C6;">
            <div style="flex-grow: 1" data-test-id="files-view-name">
              <InputForm :border="false" readonly :value="currentFile.name" label="File name" />
            </div>
            <div class="file__info flex items-end q-mb-xs">
              <EncryptedItemIcon v-if="currentFile.paranoidKey" class="file__info-icon_encrypted q-mx-xs"/>
              <SharedItemIcon v-if="isShared" width="14" height="14" class="file__info-icon_shared q-mx-xs"/>
              <LinkItemIcon v-if="currentFile.publicLink || currentFile.isLink" class="file__info-icon_link q-mx-xs"/>
              <FavoriteItemIcon v-if="currentFile.favorite" class="file__info-icon_favorite q-mx-xs"/>
            </div>
          </div>
        </div>
        <div v-if="currentFile.isLink" class="q-ma-md">
          <InputForm readonly :value="currentFile.linkUrl || currentFile.openUrl" :label="$t('FILESWEBCLIENT.LABEL_EXTERNAL_DOC_URL')" />
        </div>
        <div class="flex no-wrap justify-between q-ma-md">
          <InputForm readonly :value="fileSize" label="Size" style="width:100%" />
          <div style="width:60px;"></div>
          <InputForm readonly :value="fileDate" label="Created" style="width:100%" />
        </div>
        <div class="q-ma-md">
          <InputForm readonly :value="filePatch" label="Location" />
        </div>
        <div class="q-ma-md">
          <InputForm readonly :value="currentFile.owner" label="Owner" />
        </div>
      </div>
      <div style="height: 50px"/>
    </div>
  </q-scroll-area>
</template>
<script>
import { mapGetters, mapActions } from 'pinia'
import { useFilesStore } from '../store/index-pinia'

import date from 'src/utils/date'
import text from 'src/utils/text'
import { getApiHost } from 'src/api/helpers'
import eventBus from 'src/event-bus'

import { SHARING_LEVELS } from '../enums'
import {
  getLinkDisplayHost,
  openExternalLink,
  resolveThumbnailUrl,
} from '../utils/common'
import FileItemIcon from '../components/icons/FileItemIcon'
import InputForm from '../components/common/InputForm'
import EncryptedItemIcon from '../components/icons/item/EncryptedItemIcon'
import LinkItemIcon from '../components/icons/item/LinkItemIcon'
import FavoriteItemIcon from '../components/icons/item/FavoriteItemIcon'
import SharedItemIcon from '../components/icons/item/SharedItemIcon'
import ShareWithMeInfoIcon from '../components/icons/ShareWithMeInfoIcon'
import AppListLoader from 'src/components/common/AppListLoader'

export default {
  name: 'FileInfo',

  components: {
    FileItemIcon,
    InputForm,
    EncryptedItemIcon,
    LinkItemIcon,
    FavoriteItemIcon,
    SharedItemIcon,
    ShareWithMeInfoIcon,
    AppListLoader,
  },

  mounted() {
    this.getFile()
  },

  computed: {
    ...mapGetters(useFilesStore, [
      'currentFile',
      'currentStorage',
      'fileList',
      'isTrashStorage',
    ]),
    isShowDecryptAction() {
      if (!this.currentFile) return ''
      return this.currentFile.paranoidKey && this.currentFile.thumbnailUrl
    },
    showImagePreview() {
      if (!this.currentFile) {
        return false
      }
      if (this.currentFile.decryptViewUrl) {
        return true
      }
      if (this.currentFile.isLink && this.currentFile.thumbnailUrl && !this.currentFile.paranoidKey) {
        return true
      }
      return !!(this.currentFile.thumbnailUrl && !this.currentFile.paranoidKey && !this.currentFile.isLink)
    },
    showIconPreview() {
      if (!this.currentFile) {
        return false
      }
      return !this.showImagePreview
    },
    filePreview() {
      if (this.currentFile.decryptViewUrl){
        return this.currentFile.decryptViewUrl
      }
      if (this.currentFile.isLink) {
        return resolveThumbnailUrl(this.currentFile.thumbnailUrl)
      }
      const api = getApiHost()
      return api + this.currentFile.viewUrl
    },
    filePatch() {
      if (this.isTrashStorage) {
        return this.currentFile.trashOriginalPath || '/'
      }
      return this.currentFile.path || '/'
    },
    fileDate() {
      return date.getDate(this.currentFile.lastModified)
    },
    fileSize() {
      if (this.currentFile.isLink) {
        return getLinkDisplayHost(this.currentFile.linkUrl || this.currentFile.openUrl)
          || this.$t('COREWEBCLIENT.ACTION_OPEN_LINK')
      }
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
      if (!file && this.$route.name === 'file-view') {
        this.$router.back()
      }
    }
  },
  methods: {
    ...mapActions(useFilesStore, [
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
        const file = this.fileList.find((item) => item.name === fileName || item.id === fileName)
  
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
    openLink() {
      openExternalLink(this.currentFile?.linkUrl || this.currentFile?.openUrl)
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
</style>

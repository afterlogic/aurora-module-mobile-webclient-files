<template>
  <main-layout>
    <share-with-me-info-icon v-if="currentFile?.sharedWithMeAccess" class="absolute" style="right: 0; position: fixed; z-index: 1"/>
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
              <div class="flex items-end q-mb-xs">
                <encrypted-item-icon v-if="currentFile.paranoidKey" class="q-mx-xs"/>
                <shared-item-icon v-if="isShared" class="q-mx-xs"/>
                <link-item-icon v-if="currentFile.publicLink" class="q-mx-xs"/>
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
import EncryptedItemIcon from "../components/icons/item/EncryptedItemIcon";
import LinkItemIcon from "../components/icons/item/LinkItemIcon";
import SharedItemIcon from "../components/icons/item/SharedItemIcon";
import ShareWithMeInfoIcon from "../components/icons/ShareWithMeInfoIcon";

export default {
  name: 'FileInfo',
  components: {
    MainLayout,
    FileItemIcon,
    InputForm,
    DialogsList,
    EncryptedItemIcon,
    LinkItemIcon,
    SharedItemIcon,
    ShareWithMeInfoIcon
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
    isShared() {
      if (this.currentFile?.sharedWithMeAccess) return false
      return !!this.currentFile.shares.length || this.currentFile.sharedWithMeAccess
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

<style lang="scss">
.file-info {
  &__info {
    height: 100%;
  }
  &__info .q-scrollarea__content {
    width: 100%;
  }
  /*&__img .absolute-full {
    position: relative;
  }
  &__img div:first-child {
    display: none;
  }
  &__img .q-img__container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 400px;
    min-height: 250px;
    max-width: 100%;
  }
  &__img .q-img__container img {
    object-position: unset !important;
    object-fit: unset !important;
    width: auto;
    height: auto;
    max-width: 100%;
  }*/
}
.view-action {
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;

  letter-spacing: 0.3px;
  text-decoration-line: underline;

}
</style>

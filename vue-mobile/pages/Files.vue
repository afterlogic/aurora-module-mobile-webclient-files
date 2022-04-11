<template>
  <main-layout>
    <template v-slot:drawer>
      <q-item class="user-info flex column q-mb-xs">
        <div v-if="userName" class="user-name q-mx-md q-mb-xs">
          {{ userName }}
        </div>
        <div :class="`q-mx-md ${!userName ? 'user-name q-mb-xs' : 'user-email'}`">
          {{ userEmail }}
        </div>
      </q-item>
      <q-separator />
      <storage-item
          v-for="storage in storageList"
          :key="storage"
          :storage="storage"
      />
    </template>
    <div v-if="loadingStatus" class="full-width">
      <q-linear-progress indeterminate track-color="grey-1" color="primary"/>
    </div>
    <q-scroll-area
        :thumb-style="{ width: '5px' }"
        :class="fileListHeight"
        v-if="!loadingStatus && (folderList.length || downloadFiles.length || fileList.length)"
    >
      <folder-item
          v-for="file in folderList"
          :key="file"
          :folder="file"
          :isSelected="isSelected"
          :isCopied="isCopied"
          :touchstart="touchstart"
          :touchend="touchend"
          @touchmove="touchend"
          @showDialog="showDialog"
          class="file"
      />
      <download-file-item
          v-for="file in downloadFiles"
          :key="file.name"
          :file="file"
          class="file"
      />
      <file-item
          v-for="file in fileList"
          :key="file"
          :file="file"
          :isSelected="isSelected"
          :isCopied="isCopied"
          :touchstart="touchstart"
          :touchend="touchend"
          @touchmove="touchend"
          @showDialog="showDialog"
          class="file"
      />

      <div style="height: 70px" class="full-width" />
    </q-scroll-area>
    <files-captions v-if="!loadingStatus && !folderList.length && !downloadFiles.length && !fileList.length"/>
    <app-create-button :classes="classes" :show-dialog="showCreateButtonsDialog" v-if="isShowCreateButtons"/>
    <dialogs-list />
  </main-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import MainLayout from 'src/layouts/MainLayout'
import FileItem from '../components/FileItem'
import FolderItem from '../components/FolderItem'
import StorageItem from '../components/StorageItem'
import DialogsList from '../components/DialogsList'
import DownloadFileItem from '../components/DownloadFileItem'
import FilesCaptions from '../components/FilesCaptions'
import AppCreateButton from "src/components/common/AppCreateButton";

export default {
  name: 'Files',
  components: {
    MainLayout,
    FolderItem,
    FileItem,
    StorageItem,
    DialogsList,
    AppCreateButton,
    DownloadFileItem,
    FilesCaptions,
  },
  async mounted() {
    await this.init()
  },
  data() {
    return {
      touchTimer: null,
      isSelected: false,
    }
  },
  computed: {
    ...mapGetters('filesmobile', [
      'fileList',
      'folderList',
      'storageList',
      'selectedFiles',
      'copiedFiles',
      'downloadFiles',
      'currentFile',
      'isArchive',
      'loadingStatus',
      'currentStorage',
      'currentHeader',
      'dialogComponent'
    ]),
    ...mapGetters('core', ['userData', 'userPublicId']),
    userName() {
      if (this.userData) return this.userData.Name
      return ''
    },
    userEmail() {
      return this.userPublicId
    },
    classes() {
      if (this.dialogComponent?.component === 'CreateButtonsDialogs') {
        return 'z-index-max rotate'
      }
      return 'z-index-min'
    },
    isCopied() {
      return !!this.copiedFiles.length
    },
    isShowCreateButtons() {
      return this.currentStorage.Type !== 'shared' && !this.copiedFiles.length && this.currentHeader !== 'SearchHeader'
    },
    fileListHeight() {
      if (this.currentHeader === 'SearchHeader') return 'files__list-search'
      return 'files__list-default'
    }
  },
  watch: {
    selectedFiles(items) {
      if (!items.length) {
        setTimeout(() => {
          this.isSelected = false
        }, 300)
      }
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'asyncGetStorages',
      'asyncGetFiles',
      'selectFile',
      'changeDialogComponent',
      'changeSelectStatus',
      'changeLoadingStatus',
    ]),
    async init() {
      this.changeLoadingStatus(true)
      if (!this.storageList?.length) {
        await this.asyncGetStorages()
      }
      await this.asyncGetFiles()
      this.changeLoadingStatus(false)
    },
    showCreateButtonsDialog() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        this.changeDialogComponent({ component: '' })
      } else {
        this.changeDialogComponent({ component: 'CreateButtonsDialogs' })
      }
    },
    showDialog({ file, component }) {
      this.selectFile(file)
      this.changeDialogComponent({ component })
    },
    selectItem() {
      this.isSelected = true
      this.changeSelectStatus()
    },
    touchstart(file) {
      if (!file.downloading) {
        this.selectFile(file)
        if (!this.isArchive) {
          if (!this.isSelected && !this.isCopied) {
            this.touchTimer = setTimeout(this.selectItem, 1000)
          } else if (!this.isCopied) {
            this.changeSelectStatus()
          }
        }
      }
    },
    touchend() {
      if (this.touchTimer) clearTimeout(this.touchTimer)
    },
  },
}
</script>

<style lang="scss">
.file {
  height: 64px !important;
  border-bottom: 1px solid #F6F6F6;
  padding: 0;
  width: 100vw;
  &__name {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.3px;
    white-space: nowrap;
    overflow: hidden;
  }
  &__info {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 10px;
  }
}
.files__list-default {
  height: 100%;
}
.files__list-search {
  height: 100%;
}
.files__list .q-scrollarea__content {
  width: 100vw;
}
.user-email {
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.6);
}
.user-name {
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #000000;
}
.user-info {
  padding-top: 36px;
}
</style>

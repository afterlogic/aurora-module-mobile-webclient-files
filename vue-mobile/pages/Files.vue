<template>
  <main-layout>
    <template v-slot:drawer>
      <storage-item
        v-for="storage in storageList"
        :key="storage"
        :storage="storage"
      />
    </template>
    <div v-if="loadingStatus" class="full-width">
      <q-linear-progress indeterminate track-color="grey-1" color="primary"/>
    </div>
    <q-scroll-area :thumb-style="{ width: '5px' }" :class="fileListHeight" v-if="!loadingStatus">
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
      <files-captions v-if="!loadingStatus" />
      <div style="height: 70px" class="full-width" />
    </q-scroll-area>
    <create-button v-if="isShowCreateButtons"/>
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
import CreateButton from '../components/common/CreateButton'

export default {
  name: 'Files',
  components: {
    MainLayout,
    FolderItem,
    FileItem,
    StorageItem,
    DialogsList,
    CreateButton,
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
      'currentHeader'
    ]),
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
  height: 60px !important;
  border-bottom: 1px solid #F6F6F6;
  padding: 0;
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
  height: calc(100vh - 115px);
}
.files__list-search {
  height: calc(100vh - 129px - 60px);
}
.files__list .q-scrollarea__content {
  width: 100vw;
}
</style>

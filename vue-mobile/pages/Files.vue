<template>
  <main-layout title="Files">
    <template v-slot:drawer>
      <storage-item
        v-for="storage in storageList"
        :key="storage"
        :storage="storage"
      />
    </template>
    <q-list v-if="!loadingStatus">
      <folder-item
        v-for="file in foldersList"
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
        v-for="file in filesList"
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
      <div style="height: 130px" class="full-width" />
    </q-list>
    <div class="q-mt-xl flex items-center justify-center" v-if="loadingStatus">
      <q-circular-progress
        indeterminate
        size="40px"
        color="primary"
        class="q-ma-md"
      />
    </div>
    <create-button />
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
      'filesList',
      'foldersList',
      'storageList',
      'selectedFiles',
      'copiedFiles',
      'downloadFiles',
      'currentFile',
      'isArchive',
      'loadingStatus',
    ]),
    isCopied() {
      return !!this.copiedFiles.length
    },
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
      if (!this.currentFile) {
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0 24px 0 24px;
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
</style>

<template>
  <q-scroll-area :thumb-style="{ width: '5px' }" :class="fileListHeight" 
    v-if="!loadingStatus && (folderList.length || downloadFiles.length || fileList.length)"
  >
    <AppPullRefresh :refresh-action="asyncGetFiles">
      <FolderItem
        class="folder"
        v-for="folder in folderList"
        :key="folder.Hash"
        v-touch-hold.mouse="event => longPress(folder, event)"

        :folder="folder"
        :isSelectMode="isSelectMode"
        :isCopied="isCopied"
        :selectItemHandler="selectItem"
        :openMenuHandler="openMenu"
      />
      <DownloadFileItem
        v-for="file in downloadFiles"
        :key="file.name"
        :file="file"
        class="file"
      />
      <FileItem
        class="file"
        v-for="file in fileList"
        :key="file"
        v-touch-hold.mouse="event => longPress(file, event)"

        :file="file"
        :isSelectMode="isSelectMode"
        :isCopied="isCopied"
        :selectItemHandler="selectItem"
        :openMenuHandler="openMenu"
      />
      <div style="height: 70px" class="full-width" />
    </AppPullRefresh>
  </q-scroll-area>
  <FilesCaptions v-if="!loadingStatus && !folderList.length && !downloadFiles.length && !fileList.length"/>
</template>

<script>
import { mapGetters, mapActions } from 'pinia'
import { useFilesStore } from '../store/index-pinia'

import FolderItem from '../components/FolderItem'
import FileItem from '../components/FileItem'
import DownloadFileItem from '../components/DownloadFileItem'
import FilesCaptions from '../components/FilesCaptions'

import AppPullRefresh from 'src/components/common/AppPullRefresh'

export default {
  name: 'FileList',

  components: {
    FolderItem,
    FileItem,
    DownloadFileItem,
    FilesCaptions,
    AppPullRefresh
  },

  data() {
    return {
      isSelectMode: false,
      isLoading: false,
    }
  },
  
  computed: {
    ...mapGetters(useFilesStore, [
      'folderList',
      'fileList',
      'selectedFiles',
      'copiedFiles',
      'downloadFiles',
      'loadingStatus',
      'currentStorage',
      'currentHeader',
      'currentPathString',
      'searchText',
    ]),
    isCopied() {
      return !!this.copiedFiles.length
    },
    fileListHeight() {
      if (this.currentHeader === 'SearchHeader') return 'files__list-search'
      return 'files__list-default'
    },
  },
  watch: {
    currentStorage: {
      handler: async function () {
        this.fetchData()
      },
      immediate: true
    },
    currentPathString: {
      handler: async function () {
        this.fetchData()
      },
      immediate: true
    },
    searchText: {
      handler: async function (v) {
        this.fetchData()
      },
      immediate: true
    },
    selectedFiles(items) {
      if (!items.length) {
        this.isSelectMode = false
      }
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'asyncGetFiles',
      'selectFile',
      'changeDialogComponent',
      'changeLoadingStatus',
    ]),
    async fetchData() {
      if (this.currentStorage && this.currentPathString) {
        this.changeLoadingStatus(true)
        if (!this.isLoading) {
          this.isLoading = true
          await this.asyncGetFiles()
          this.isLoading = false
        }
        this.changeLoadingStatus(false)
      }
    },
    openMenu({ file, component }) {
      this.selectFile(file)
      this.changeDialogComponent({ component })
    },
    selectItem(item) {
      item.isSelected = !item.isSelected
    },
    longPress(item) {
      this.isSelectMode = true
      this.selectItem(item)
    },
  },
}
</script>

<style lang="scss">
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

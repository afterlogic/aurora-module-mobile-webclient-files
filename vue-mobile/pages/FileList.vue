<template>
  <div data-test-id="files-list" class="fit column files-list">
  <div v-if="isShowEmptyTrashButton" class="list__info col-auto">
    <div
      data-test-id="files-empty-trash-button"
      @click="showEmptyTrashDialog"
      class="list__button list__button_with-icon"
    >
      <ActionIcon class="list__button-icon" icon="DeleteIcon" with-cross />
      {{ $t('FILESMOBILEWEBCLIENT.ACTION_EMPTY_TRASH') }}
    </div>
  </div>

  <AppListLoader v-if="loadingStatus" initial class="col" />
  <q-scroll-area
    v-else-if="hasListItems"
    :thumb-style="{ width: '5px' }"
    class="files__list col"
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
  <FilesCaptions v-else-if="!loadingStatus" class="col" />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapActions, mapState } from 'pinia'
import { useFilesStore } from '../store/index-pinia'

import FolderItem from '../components/FolderItem'
import FileItem from '../components/FileItem'
import DownloadFileItem from '../components/DownloadFileItem'
import FilesCaptions from '../components/FilesCaptions'
import ActionIcon from '../components/common/ActionIcon'

import AppPullRefresh from 'src/components/common/AppPullRefresh'
import AppListLoader from 'src/components/common/AppListLoader'

export default {
  name: 'FileList',

  components: {
    FolderItem,
    FileItem,
    DownloadFileItem,
    FilesCaptions,
    ActionIcon,
    AppPullRefresh,
    AppListLoader,
  },

  data() {
    return {
      isSelectMode: false,
    }
  },
  
  computed: {
    ...mapState(useFilesStore, [
      'currentPath',
    ]),
    ...mapGetters(useFilesStore, [
      'folderList',
      'fileList',
      'selectedFiles',
      'copiedFiles',
      'downloadFiles',
      'loadingStatus',
      'currentStorage',
      'currentPathString',
      'searchText',
      'isTrashStorage',
    ]),
    isCopied() {
      return !!this.copiedFiles.length
    },
    hasListItems() {
      return this.folderList.length > 0 || this.downloadFiles.length > 0 || this.fileList.length > 0
    },
    isShowEmptyTrashButton() {
      return (
        this.isTrashStorage
        && !this.loadingStatus
        && !(this.currentPath?.length)
        && !(this.searchText || '').trim()
        && this.hasListItems
      )
    },
  },
  watch: {
    currentStorage: {
      handler: function () {
        // Ensure we immediately hide the previous list and show the loader
        // when switching storages (before asyncGetFiles resolves).
        this.changeLoadingStatus(true)
        this.fetchData()
      },
    },
    currentPathString: {
      handler: async function () {
        this.fetchData()
      },
    },
    searchText: {
      handler: async function () {
        this.fetchData()
      },
    },
    selectedFiles(items) {
      if (!items.length) {
        this.isSelectMode = false
      }
    },
  },
  created() {
    // Avoid empty-state flash on first paint before fetch starts.
    if (!this.hasListItems) {
      this.changeLoadingStatus(true)
    }
  },
  mounted() {
    if (!this.hasListItems) {
      this.fetchData()
    }
  },
  methods: {
    ...mapActions(useFilesStore, [
      'asyncGetFiles',
      'selectFile',
      'changeDialogComponent',
      'changeLoadingStatus',
    ]),
    async fetchData() {
      if (!this.currentStorage?.Type) {
        return
      }
      await this.asyncGetFiles()
    },
    openMenu({ file, component }) {
      this.selectFile(file)
      this.changeDialogComponent({ component })
    },
    showEmptyTrashDialog() {
      this.changeDialogComponent({
        getComponent: () => defineAsyncComponent(() => import('../components/dialogs/EmptyTrashDialog')),
      })
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
.files-list {
  min-height: 0;

  .files__list {
    min-height: 0;
  }
}

.files__list .q-scrollarea__content {
  width: 100vw;
}

.list {
  &__info {
    text-align: center;
    color: #969494;
    padding: 16px 32px 32px 32px;
  }

  &__button {
    color: #469CF8;
    margin-top: 12px;
  }

  &__button_with-icon {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__button-icon {
    flex-shrink: 0;
  }
}
</style>

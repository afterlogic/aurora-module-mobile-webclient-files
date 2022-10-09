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
      <app-pull-refresh :refresh-action="asyncGetFiles">
        <folder-item
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
        <download-file-item
            v-for="file in downloadFiles"
            :key="file.name"
            :file="file"
            class="file"
        />
        <file-item
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
      </app-pull-refresh>
    </q-scroll-area>
    <files-captions v-if="!loadingStatus && !folderList.length && !downloadFiles.length && !fileList.length"/>
    <app-create-button :rotate="appButtonRotate" @click="showCreateButtonsDialog" v-if="isShowCreateButtons"/>
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

import AppCreateButton from 'src/components/common/AppCreateButton'
import AppPullRefresh from 'src/components/common/AppPullRefresh'

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
    AppPullRefresh
  },

  async mounted() {
    await this.init()
  },

  data() {
    return {
      touchTimer: null,
      isSelectMode: false,
      notChoose: false,
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
    ...mapGetters('core', [
      'userData',
      'userPublicId'
    ]),
    userName() {
      if (this.userData) return this.userData.Name
      return ''
    },
    userEmail() {
      return this.userPublicId
    },
    appButtonRotate() {
      return this.dialogComponent?.component === 'CreateButtonsDialogs'
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
        this.isSelectMode = false
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
    // onRefresh() {
    //   setTimeout(() => {
    //     loading.value = false;
    //     count.value++;
    //   }, 1000);
    // },
    showCreateButtonsDialog() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        this.changeDialogComponent({ component: '' })
      } else {
        this.changeDialogComponent({ component: 'CreateButtonsDialogs' })
      }
    },
    openMenu({ file, component }) {
      this.selectFile(file)
      this.changeDialogComponent({ component })
    },
    selectItem(item) {
      this.changeSelectStatus(item)
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

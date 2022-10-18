<template>
  <div class="caption full-height flex items-center justify-center">
    <div class="flex column caption__box" v-if="isStorageEmpty">
      <div class="q-mb-md">
        <box-icon />
      </div>
      <div>This storage is empty</div>
    </div>
    <div class="flex column caption__box" v-if="isFolderEmpty">
      <div class="q-mb-md">
        <empty-folder-icon />
      </div>
      <div>Folder is empty</div>
    </div>
    <div class="caption__inscription" v-if="isNothingFound">Nothing found</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BoxIcon from './icons/BoxIcon'
import EmptyFolderIcon from "./icons/EmptyFolderIcon";

export default {
  name: 'FilesCaptions',
  components: {
    BoxIcon,
    EmptyFolderIcon
  },
  computed: {
    ...mapGetters('filesmobile', [
      'downloadFiles',
      'fileList',
      'folderList',
      'searchText',
      'currentStorage',
      'currentPath',
      'loadingStatus',
      'currentPath',
      'downloadFiles'
    ]),
    isFolder() {
      return !!this.currentPath
    },
    isFolderEmpty() {
      return (
        !this.loadingStatus &&
        this.isNoFiles &&
        !this.searchText &&
        this.isFolder &&
        !this.downloadFiles.length &&
        this.currentPath.length !== 1
      )
    },
    isNothingFound() {
      return (
        !this.loadingStatus &&
        this.isNoFiles &&
        this.searchText &&
        !this.downloadFiles.length
      )
    },
    isStorageEmpty() {
      return (
        this.isNoFiles &&
        this.currentPath.length === 1 &&
        !this.isFolderEmpty &&
        !this.isNothingFound &&
        !this.downloadFiles.length
      )
    },
    isNoFiles() {
      return !this.fileList.length && !this.folderList.length
    },
  },
}
</script>

<style lang="scss" scoped>
.caption {
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: #969494;
}
</style>

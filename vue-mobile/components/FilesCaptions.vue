<template>
  <div class="caption flex items-center justify-center">
    <div class="caption__inscription" v-if="isFolderEmpty">Folder is empty</div>
    <div class="flex column caption__box" v-if="isStorageEmpty">
      <div class="q-mb-md">
        <box-icon />
      </div>
      <div>This storage is empty</div>
    </div>
    <div class="caption__inscription" v-if="isNothingFound">Nothing found</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BoxIcon from './icons/BoxIcon'

export default {
  name: 'FilesCaptions',
  components: {
    BoxIcon,
  },
  computed: {
    ...mapGetters('files', [
      'downloadFiles',
      'filesList',
      'foldersList',
      'searchText',
      'currentStorage',
      'currentPath',
      'loadingStatus',
      'currentPaths',
    ]),
    isFolder() {
      return !!this.currentPath
    },
    isFolderEmpty() {
      return (
        !this.loadingStatus &&
        this.isNoFiles &&
        !this.searchText &&
        this.currentStorage.Type !== 'shared' &&
        this.isFolder &&
        !this.downloadFiles.length &&
        this.currentPaths.length !== 1
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
        this.currentPaths.length === 1 &&
        !this.isFolderEmpty &&
        !this.isNothingFound
      )
    },
    isNoFiles() {
      return !this.filesList.length && !this.foldersList.length
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
  &__box {
    margin-top: 266px;
  }
  &__inscription {
    margin-top: 50px;
  }
}
</style>

<template>
  <div>
    <DefaultHeader v-if="isDefaultHeader" @openDrawer="$emit('openDrawer')" />
    <SelectHeader v-if="isSelectHeader" :items="selectedFiles" />
    <CopyMoveHeader v-if="isCopyMoveHeader" />
    <SearchHeader v-if="isSearchHeader" />
    <FileInfoHeader v-if="$router.currentRoute.value.name === 'file-view'" />
  </div>
</template>

<script>
import { mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import DefaultHeader from './DefaultHeader'
import SelectHeader from './SelectHeader'
import CopyMoveHeader from './CopyMoveHeader'
import SearchHeader from './SearchHeader'
import FileInfoHeader from './FileInfoHeader'

export default {
  name: 'FilesHeader',
  components: {
    DefaultHeader,
    SelectHeader,
    CopyMoveHeader,
    SearchHeader,
    FileInfoHeader,
  },

  computed: {
    ...mapGetters(useFilesStore, ['selectedFiles', 'copiedFiles', 'currentHeader']),
    routeName() {
      return this.$router.currentRoute.value.name
    },
    isFileListRoute() {
      return this.routeName === 'file-list' || this.routeName === 'files'
    },
    isDefaultHeader() {
      return this.isFileListRoute
        && !this.selectedFiles.length
        && !this.copiedFiles.length
        && !this.isSearchHeader
    },
    isSelectHeader() {
      return this.isFileListRoute
        && !!this.selectedFiles.length
        && !this.copiedFiles.length
        && !this.isSearchHeader
    },
    isCopyMoveHeader() {
      return this.isFileListRoute && this.copiedFiles.length && !this.isSearchHeader
    },
    isSearchHeader() {
      return this.isFileListRoute && this.currentHeader === 'SearchHeader'
    },
  },
  beforeUnmount() {
    // this.changeSearchText('')
    // this.changeCurrentHeader('')
    // this.clearItemLists()
  },
}
</script>

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
    isDefaultHeader() {
      return this.routeName === 'file-list'
        && !this.selectedFiles.length
        && !this.copiedFiles.length
        && !this.isSearchHeader
    },
    isSelectHeader() {
      return this.routeName === 'file-list'
        && !!this.selectedFiles.length
        && !this.copiedFiles.length
        && !this.isSearchHeader
    },
    isCopyMoveHeader() {
      return this.routeName === 'file-list' && this.copiedFiles.length && !this.isSearchHeader
    },
    isSearchHeader() {
      return this.routeName === 'file-list' && this.currentHeader === 'SearchHeader'
    },
  },
  beforeUnmount() {
    // this.changeSearchText('')
    // this.changeCurrentHeader('')
    // this.clearItemLists()
  },
}
</script>

<template>
  <div>
    <default-header v-if="routeName === 'file-list' && isDefaultHeader" @openDrawer="$emit('openDrawer')" />
    <select-header v-if="routeName === 'file-list' && isSelectHeader" :items="selectedFiles" />
    <copy-move-header v-if="routeName === 'file-list' && isCopyMoveHeader" />
    <search-header v-if="isSearchHeader" />
    <FileInfoHeader v-if="$router.currentRoute.value.name === 'file-view'" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
    ...mapGetters('filesmobile', ['selectedFiles', 'copiedFiles', 'currentHeader']),
    routeName() {
      return this.$router.currentRoute.value.name
    },
    isDefaultHeader() {
      return (
        !this.selectedFiles.length &&
        !this.copiedFiles.length &&
        !this.isSearchHeader
      )
    },
    isSelectHeader() {
      return (
        this.selectedFiles.length &&
        !this.copiedFiles.length &&
        !this.isSearchHeader
      )
    },
    isCopyMoveHeader() {
      return this.copiedFiles.length && !this.isSearchHeader
    },
    isSearchHeader() {
      return this.currentHeader === 'SearchHeader'
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentHeader',
      'changeSearchText',
      'clearItemLists',
    ]),
  },
  beforeUnmount() {
    this.changeSearchText('')
    this.changeCurrentHeader('')
    this.clearItemLists()
  },
}
</script>

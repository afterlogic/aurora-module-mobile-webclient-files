<template>
  <div>
    <default-header v-if="isDefaultHeader" @openDrawer="$emit('openDrawer')" />
    <select-header v-if="isSelectHeader" :items="selectedFiles" />
    <copy-move-header v-if="isCopyMoveHeader" />
    <search-header v-if="isSearchHeader" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import DefaultHeader from './DefaultHeader'
import SelectHeader from './SelectHeader'
import CopyMoveHeader from './CopyMoveHeader'
import SearchHeader from './SearchHeader'

export default {
  name: 'FilesHeader',
  components: {
    DefaultHeader,
    SelectHeader,
    CopyMoveHeader,
    SearchHeader,
  },

  computed: {
    ...mapGetters('filesmobile', ['selectedFiles', 'copiedFiles', 'currentHeader']),
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

<style scoped></style>

<template>
  <copied-footer v-if="isCopiedFiles"></copied-footer>
  <default-footer v-else></default-footer>
</template>

<script>
import { mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import DefaultFooter from 'src/components/main/DefaultFooter'
import CopiedFooter from './CopiedFooter'

export default {
  name: 'FilesFooter',

  components: {
    DefaultFooter,
    CopiedFooter,
  },

  computed: {
    ...mapGetters(useFilesStore, ['copiedFiles']),

    isCopiedFiles() {
      return !!this.copiedFiles.length
    },
  },
}
</script>

<style scoped></style>

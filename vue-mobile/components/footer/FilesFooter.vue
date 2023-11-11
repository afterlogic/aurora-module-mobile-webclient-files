<template>
  <CopiedFooter v-if="isCopiedFiles"></CopiedFooter>
  <DefaultFooter v-else></DefaultFooter>
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

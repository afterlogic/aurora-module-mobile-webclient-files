<template>
  <component :is="component" />
</template>

<script>
import { mapGetters } from 'vuex'

import DefaultFooter from 'components/common/footer/DefaultFooter'
import CopiedFooter from './CopiedFooter'

export default {
  name: 'FileFooter',
  components: {
    DefaultFooter,
    CopiedFooter,
  },
  computed: {
    ...mapGetters('files', ['copiedFiles']),
    component() {
      return this.isCopied ? 'CopiedFooter' : 'DefaultFooter'
    },
    isCopied() {
      return !!this.copiedFiles.length
    },
  },
}
</script>

<style scoped></style>

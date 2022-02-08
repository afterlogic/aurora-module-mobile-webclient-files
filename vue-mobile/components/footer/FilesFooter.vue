<template>
  <q-footer elevated class="bg-white">
    <copied-footer v-if="isCopiedFiles"></copied-footer>
    <default-footer v-else></default-footer>
  </q-footer>
</template>

<script>
import { mapGetters } from 'vuex'

import DefaultFooter from 'src/components/main/DefaultFooter'
import CopiedFooter from './CopiedFooter'

export default {
  name: 'FilesFooter',

  components: {
    DefaultFooter,
    CopiedFooter,
  },

  computed: {
    ...mapGetters('files', ['copiedFiles']),

    isCopiedFiles() {
      return !!this.copiedFiles.length
    },
  },
}
</script>

<style scoped></style>

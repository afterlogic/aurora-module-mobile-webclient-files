<template>
  <q-toolbar style="height: 60px" class="full-width">
    <div class="full-width flex no-wrap justify-between">
      <app-button
        size="15px"
        flat
        class="q-px-md items-start"
        color="black"
        label="Cancel"
        @click="cancel"
      />
      <app-button
        size="15px"
        flat
        class="q-px-sm"
        color="black"
        label="Copy"
        @click="copy"
      />
      <app-button
        size="15px"
        flat
        class="q-px-md items-end"
        color="black"
        label="Move"
        @click="move"
      />
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions } from 'vuex'

import AppButton from 'components/common/AppButton'

export default {
  name: 'CopiedFooter',
  components: {
    AppButton,
  },
  methods: {
    ...mapActions('files', ['removeCopiedFiles', 'copyItems', 'moveItems']),
    cancel() {
      this.removeCopiedFiles()
    },
    copy() {
      this.copyItems()
    },
    move() {
      this.moveItems()
    },
  },
}
</script>

<style scoped></style>

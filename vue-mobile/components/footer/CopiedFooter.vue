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
        :class="showMoveAction ? 'q-px-sm' : 'q-px-md items-end'"
        color="black"
        label="Copy"
        @click="copy"
      />
      <app-button
        v-if="showMoveAction"
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
import {mapActions, mapGetters} from 'vuex'

import AppButton from 'components/common/AppButton'

export default {
  name: 'CopiedFooter',
  components: {
    AppButton,
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage']),
    showMoveAction() {
      return this.currentStorage.Type !== 'shared'
    }
  },
  methods: {
    ...mapActions('filesmobile', ['removeCopiedFiles', 'copyItems', 'moveItems']),
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

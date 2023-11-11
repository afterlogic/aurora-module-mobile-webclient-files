<template>
  <q-footer elevated class="bg-white">
    <q-toolbar style="height: 60px" class="full-width">
      <div class="full-width flex no-wrap justify-between">
        <AppButton
            size="15px"
            flat
            class="q-px-md items-start"
            color="black"
            label="Cancel"
            @click="cancel"
        />
        <AppButton
            size="15px"
            flat
            :class="showMoveAction ? 'q-px-sm' : 'q-px-md items-end'"
            color="black"
            label="Copy"
            @click="copy"
        />
        <AppButton
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
  </q-footer>
</template>

<script>
import {mapActions, mapGetters} from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppButton from 'components/common/AppButton'

export default {
  name: 'CopiedFooter',
  components: {
    AppButton,
  },
  computed: {
    ...mapGetters(useFilesStore, ['currentStorage', 'copiedFiles']),
    showMoveAction() {
      return this.currentStorage.Type !== 'shared' && this.copiedFiles[0].type !== 'shared'
    }
  },
  methods: {
    ...mapActions(useFilesStore, ['removeCopiedFiles', 'copyItems', 'moveItems']),
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

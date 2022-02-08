<template>
  <q-toolbar
    style="height: 55px; font-size: 16px; padding: 0"
    class="bg-primary"
  >
    <q-card-actions align="left" class="col-3">
      <q-btn
        flat
        size="15px"
        @click="remove"
        color="black"
        round
        dense
        icon="close"
      />
    </q-card-actions>
    <div class="text-center text-black text-bold col-6">
      <span>{{ `Selected: ${items.length}` }}</span>
    </div>
    <div class="col-3 flex justify-end q-pr-sm">
      <q-btn
        flat
        size="15px"
        color="black"
        round
        dense
        icon="drive_file_move"
        @click="copyItems"
      />
      <q-btn
        flat
        size="15px"
        color="black"
        round
        dense
        icon="delete_outline"
        @click="deleteItems"
      />
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions } from 'vuex'

import { fileActions } from 'src/utils/files/file-actions'

export default {
  name: 'SelectHeader',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'removeSelectedItems',
      'changeDialogComponent',
      'addCopyItems',
    ]),
    remove() {
      this.removeSelectedItems({ items: this.items })
    },
    deleteItems() {
      const deleteAction = fileActions.delete
      if (deleteAction.component) {
        this.changeDialogComponent({ component: deleteAction.component })
      }
    },
    copyItems() {
      this.addCopyItems({ items: this.items })
      this.removeSelectedItems({ items: this.items })
    },
  },
}
</script>

<style scoped></style>

<template>
  <q-toolbar
    style="height: 55px; font-size: 16px; padding: 0"
    class="bg-primary"
  >
    <q-card-actions align="left" class="col-3">
      <q-btn
        v-if="currentPaths.length <= 1"
        flat
        size="15px"
        color="black"
        round
        dense
        icon="close"
        @click="removeCopiedItems"
      />
      <q-btn
        v-if="currentPaths.length > 1"
        flat
        size="15px"
        color="black"
        round
        dense
        icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>
    <div class="text-center text-black text-bold col-6">
      <span>Move files/folders</span>
    </div>
    <div class="col-3 flex justify-end q-pr-sm">
      <q-btn
        flat
        size="15px"
        color="black"
        round
        dense
        icon="create_new_folder"
        @click="createFolder"
      />
      <q-btn flat size="15px" color="black" round dense icon="list" />
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CopyMoveHeader',
  computed: {
    ...mapGetters('files', ['copiedFiles', 'currentPaths']),
  },
  methods: {
    ...mapActions('files', [
      'removeCopiedFiles',
      'changeDialogComponent',
      'changeCurrentPaths',
      'asyncGetFiles',
    ]),
    removeCopiedItems() {
      this.removeCopiedFiles()
    },
    createFolder() {
      this.changeDialogComponent({ component: 'CreateFolderDialog' })
    },
    async onPreviousPath() {
      await this.changeCurrentPaths({
        path: this.currentPaths[this.currentPaths.length - 2],
        lastStorage: false,
      })
      await this.asyncGetFiles()
    },
  },
}
</script>

<style scoped></style>

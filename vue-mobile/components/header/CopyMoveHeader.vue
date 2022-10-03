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
    <div class="col-3 flex justify-end q-mr-md">
      <q-btn
        flat
        size="15px"
        color="black"
        round
        dense
        icon="create_new_folder"
        @click="createFolder"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown v-close-popup :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <action-icon class="q-mr-md" icon="SelectStorageIcon" />
          </template>
          <q-list v-close-popup style="width: 205px; min-height: 55px">
            <storage-item
                v-for="storage in storageList"
                :key="storage"
                :storage="storage"
            />
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import StorageItem from "../StorageItem";
import ActionIcon from "../common/ActionIcon";

export default {
  name: 'CopyMoveHeader',
  components: {
    StorageItem,
    ActionIcon
  },
  computed: {
    ...mapGetters('filesmobile', ['copiedFiles', 'currentPaths', 'storageList']),
  },
  methods: {
    ...mapActions('filesmobile', [
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

<style>
.dropdown-more .q-btn-dropdown__arrow {
  display: none;
}
</style>

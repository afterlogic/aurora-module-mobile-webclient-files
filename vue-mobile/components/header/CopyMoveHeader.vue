<template>
  <q-toolbar class="app-header bg-primary">
    <div class="col app-header__left">
      <q-btn icon="close" @click="removeCopiedItems" v-if="currentPath.length <= 1" color="black" round flat dense />
      <q-btn icon="chevron_left" @click="onPreviousPath" v-if="currentPath.length > 1" color="black" round flat dense />
    </div>
    <div class="col app-header__title">
      Move files/folders
    </div>
    <div class="col app-header__right">
      <q-btn icon="create_new_folder" @click="createFolder" color="black" round flat dense />
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

import StorageItem from '../StorageItem'
import ActionIcon from '../common/ActionIcon'

export default {
  name: 'CopyMoveHeader',
  components: {
    StorageItem,
    ActionIcon
  },
  computed: {
    ...mapGetters('filesmobile', ['copiedFiles', 'currentPath', 'storageList']),
  },
  methods: {
    ...mapActions('filesmobile', [
      'removeCopiedFiles',
      'changeDialogComponent',
      'changeCurrentPath',
      'asyncGetFiles',
    ]),
    removeCopiedItems() {
      this.removeCopiedFiles()
    },
    createFolder() {
      this.changeDialogComponent({ component: 'CreateFolderDialog' })
    },
    async onPreviousPath() {
      // await this.changeCurrentPath({
      //   path: this.currentPath[this.currentPath.length - 2],
      //   lastStorage: false,
      // })
      await this.asyncGetFiles()
    },
  },
}
</script>

<template>
  <q-toolbar data-test-id="files-copymove-header" class="app-header bg-primary">
    <div class="col app-header__left">
      <AppHeaderButton
        data-test-id="files-copymove-close"
        icon="close"
        @click="removeCopiedItems"
        v-if="!currentPath?.length"
      />
      <AppHeaderButton
        data-test-id="files-copymove-back"
        icon="chevron_left"
        @click="onPreviousPath"
        v-if="currentPath?.length"
      />
    </div>
    <div class="col app-header__title">
      Move files/folders
    </div>
    <div class="col app-header__right">
      <AppHeaderButton
        v-if="isCreateAllowed"
        icon="create_new_folder"
        @click="createFolder"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown v-close-popup :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <ActionIcon class="q-mr-md" icon="SelectStorageIcon" />
          </template>
          <q-list v-close-popup style="width: 205px; min-height: 55px">
            <StorageItem
                v-for="storage in copyTargetStorages"
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
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import StorageItem from '../StorageItem'
import ActionIcon from '../common/ActionIcon'
import AppHeaderButton from 'src/components/common/AppHeaderButton'
import { STORAGE_TYPES } from '../../enums'

export default {
  name: 'CopyMoveHeader',
  components: {
    StorageItem,
    ActionIcon,
    AppHeaderButton,
  },
  computed: {
    ...mapGetters(useFilesStore, ['copiedFiles', 'currentPath', 'storageList', 'isCreateAllowed']),
    copyTargetStorages() {
      return this.storageList.filter((storage) => {
        return storage.Type !== STORAGE_TYPES.FAVORITES
          && storage.Type !== STORAGE_TYPES.TRASH
      })
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'removeCopiedFiles',
      'changeDialogComponent',
      'asyncGetFiles',
    ]),
    removeCopiedItems() {
      this.removeCopiedFiles()
    },
    createFolder() {
      this.changeDialogComponent({ component: 'CreateFolderDialog' })
    },
    async onPreviousPath() {
      this.$router.back()
    },
  },
}
</script>

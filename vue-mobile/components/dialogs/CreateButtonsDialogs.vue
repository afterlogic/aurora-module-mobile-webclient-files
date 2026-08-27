<template>
  <!-- <q-dialog transition-show="fade" transition-hide="fade" transition-duration="200" v-model="openDialog"> -->
  <q-dialog transition-show="fade" transition-hide="fade" transition-duration="200">
    <div data-test-id="files-create-menu" class="flex column absolute create-buttons">
      <div
        data-test-id="files-upload-file"
        class="create-buttons__item upload-file"
        @click="uploadFile"
      >
        <UploadFileIcon />
      </div>
      <div
        v-if="isCreateShortcutAllowed"
        data-test-id="files-create-shortcut"
        class="create-buttons__item create-shortcut"
        @click="createShortcut"
      >
        <CreateShortcutIcon />
      </div>
      <div
        data-test-id="files-create-folder"
        class="create-buttons__item create-folder"
        @click="createFolder"
      >
        <CreateFolderIcon />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import CreateFolderIcon from '../icons/actions/CreateFolderIcon'
import CreateShortcutIcon from '../icons/actions/CreateShortcutIcon'
import UploadFileIcon from '../icons/actions/UploadFileIcon'

export default {
  name: 'CreateButtonsDialogs',

  components: {
    CreateFolderIcon,
    CreateShortcutIcon,
    UploadFileIcon,
  },

  computed: {
    ...mapGetters(useFilesStore, ['isCreateShortcutAllowed']),
  },

  methods: {
    ...mapActions(useFilesStore, ['changeDialogComponent']),
    createFolder() {
      this.$emit('closeDialog')
      this.changeDialogComponent({ getComponent: () => { return defineAsyncComponent(() => import('./CreateFolderDialog')) } })
    },
    createShortcut() {
      this.$emit('closeDialog')
      this.changeDialogComponent({ getComponent: () => { return defineAsyncComponent(() => import('./CreateLinkDialog')) } })
    },
    uploadFile() {
      this.changeDialogComponent({ component: 'FileUploader' })
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.create-buttons {
  box-shadow: none;
  position: fixed;
  z-index: 1;
  bottom: 132px;
  right: 16px;
  margin-right: 0px;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__item {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 0 10px rgba(28, 133, 231, 0.4);
  }
}

.create-folder svg,
.create-shortcut svg {
  width: 20px;
}
</style>

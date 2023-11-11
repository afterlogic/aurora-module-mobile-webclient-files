<template>
  <component
    :is="currentComponent"

    v-model="isShowDialog"
    :file="currentFile"
    :dialog="isShowDialog"

    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
  <FileUploader />
</template>

<script>
import { mapGetters, mapActions } from 'pinia'
import { useFilesStore } from '../store/index-pinia'

import _ from 'lodash'

import FileMenuDialog from './dialogs/FileMenuDialog'
import CreateButtonsDialogs from './dialogs/CreateButtonsDialogs'
import FileUploader from './dialogs/FileUploader'

// import CreateFolderDialog from './dialogs/CreateFolderDialog'
// import RenameItemDialog from './dialogs/RenameItemDialog'
// import DeleteItemsDialog from './dialogs/DeleteItemsDialog'
// import CreateShareableLinkDialog from './dialogs/CreateShareableLinkDialog'
// import ShareWithTeammatesDialog from './dialogs/ShareWithTeammatesDialog'
// import ShareLeaveDialog from './dialogs/ShareLeaveDialog'

export default {
  name: 'DialogsList',

  components: {
    FileMenuDialog,
    CreateButtonsDialogs,
    FileUploader,
    
    // CreateFolderDialog,
    // RenameItemDialog,
    // DeleteItemsDialog,
    // CreateShareableLinkDialog,
    // ShareWithTeammatesDialog,
    // ShareLeaveDialog
  },

  data() {
    return {
      isShowDialog: false,
      currentComponent: null,
      // component: 'FileMenuDialog',
    }
  },

  computed: {
    ...mapGetters(useFilesStore, ['dialogComponent', 'currentFile']),
  },

  watch: {
    dialogComponent(value) {
      if (value && value?.component !== 'FileUploader') {
        if (value?.getComponent) {
          this.currentComponent = value.getComponent()
          this.isShowDialog = true
        } else if (value?.component) {
          this.currentComponent = value.component
          this.isShowDialog = true
        } else {
          this.isShowDialog = false
        }
      }
    },
    isShowDialog(v) {
      if (!v && this.dialogComponent?.component === 'CreateButtonsDialogs')
        this.changeDialogComponent(null)
    },
  },

  methods: {
    ...mapActions(useFilesStore, [
      'changeDialogComponent'
    ]),
    dialogAction(action) {
      this.closeDialog()
      if (action.getComponent) {
        this.changeDialogComponent({ getComponent: action.getComponent})
      } else if (action.component) {
        this.changeDialogComponent({ component: action.component, name: action.name })
      } else if (action.method) {
        action.method(this)
      }
    },
    closeDialog(hasChanges) {
      if (typeof hasChanges === 'function' && hasChanges()) {
        this.$root.unsavedChangesDialog(() => this.isShowDialog = false)
      } else {
        this.isShowDialog = false
      }
    },
  },
}
</script>

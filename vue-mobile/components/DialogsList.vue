<template>
  <component
    :is="component()"

    v-model="isShowDialog"
    :file="currentFile"
    :dialog="isShowDialog"

    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
  <file-uploader />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

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
      component: () => {},
      // component: 'FileMenuDialog',
    }
  },

  computed: {
    ...mapGetters('filesmobile', ['dialogComponent', 'currentFile']),
    // componentInstance() {
    //   const name = this.dialogComponent
    //   return defineAsyncComponent(() => import(`./storage/${name}StorageIcon`))
    // }
  },

  watch: {
    dialogComponent(val) {
      if (val.component !== 'FileUploader') {
        if (!val.component && !val.getComponent) {
          this.isShowDialog = false
        } else {
          if (val.getComponent) {
            this.component = val.getComponent
          } else {
            this.component = () => val.component
          }
          this.isShowDialog = true
        }
      }
    },
    dialog(val) {
      if (!val && this.dialogComponent.name === 'createButtonsDialogs')
        this.changeDialogComponent({ component: '' })
    },
  },

  methods: {
    ...mapActions('filesmobile', [
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
      if (_.isFunction(hasChanges)) {
        if (hasChanges()) {
          this.$root.unsavedChangesDialog(() => this.isShowDialog = false)
        } else {
          this.isShowDialog = false
        }
      } else {
        this.isShowDialog = false
      }
    },
  },
}
</script>

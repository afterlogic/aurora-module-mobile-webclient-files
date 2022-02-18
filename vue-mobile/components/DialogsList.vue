<template>
  <component
    :is="component"
    :file="currentFile"
    v-model="dialog"
    @closeDialog="closeDialog"
    @dialogAction="dialogAction"
  />
  <file-uploader />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import FileMenuDialog from './dialogs/FileMenuDialog'
import RenameItemDialog from './dialogs/RenameItemDialog'
import DeleteItemsDialog from './dialogs/DeleteItemsDialog'
import CreateFolderDialog from './dialogs/CreateFolderDialog'
import CreateButtonsDialogs from './dialogs/CreateButtonsDialogs'
import CreateShareableLinkDialog from './dialogs/CreateShareableLinkDialog'
import ShareWithTeammatesDialog from './dialogs/ShareWithTeammatesDialog'
import FileUploader from './dialogs/FileUploader'
import ShareLeaveDialog from "./dialogs/ShareLeaveDialog";

export default {
  name: 'DialogsList',
  components: {
    FileMenuDialog,
    RenameItemDialog,
    DeleteItemsDialog,
    CreateFolderDialog,
    CreateButtonsDialogs,
    CreateShareableLinkDialog,
    ShareWithTeammatesDialog,
    FileUploader,
    ShareLeaveDialog
  },
  data() {
    return {
      dialog: false,
      component: 'FileMenuDialog',
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['dialogComponent', 'currentFile']),
  },
  watch: {
    dialogComponent(val) {
      if (val.component !== 'FileUploader') {
        if (!val.component) {
          this.dialog = false
        } else {
          this.component = val.component
          this.dialog = true
        }
      }
    },
    dialog(val) {
      if (!val && this.dialogComponent.component === 'CreateButtonsDialogs')
        this.changeDialogComponent({ component: '' })
    },
  },
  methods: {
    ...mapActions('filesmobile', ['changeDialogComponent']),
    dialogAction(action) {
      this.closeDialog()
      if (action.component) {
        this.changeDialogComponent({ component: action.component })
      } else if (action.method) {
        action.method(this.$store)
      }
    },
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>

<style scoped></style>

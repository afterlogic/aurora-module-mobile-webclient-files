<template>
  <q-dialog
    transition-show="fade"
    transition-hide="fade"
    transition-duration="200"
    v-model="openDialog"
  >
    <div class="flex column q-pa-sm absolute create-buttons">
      <upload-file-icon @click="uploadFile" />
      <create-folder-icon @click="createFolder" />
    </div>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import CreateFolderIcon from '../icons/actions/CreateFolderIcon'
import UploadFileIcon from '../icons/actions/UploadFileIcon'

export default {
  name: 'CreateButtonsDialogs',
  components: {
    CreateFolderIcon,
    UploadFileIcon,
  },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  data() {
    return {
      openDialog: false,
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions('files', ['changeDialogComponent']),
    createFolder() {
      this.$emit('closeDialog')
      this.changeDialogComponent({ component: 'CreateFolderDialog' })
    },
    uploadFile() {
      this.changeDialogComponent({ component: 'FileUploader' })
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped>
.create-buttons {
  box-shadow: none;
  position: fixed;
  z-index: 1;
  bottom: 138px;
  right: 9px;
  margin-right: 2px;
}
</style>

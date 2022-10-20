<template>
  <!-- <q-dialog transition-show="fade" transition-hide="fade" transition-duration="200" v-model="openDialog"> -->
  <q-dialog transition-show="fade" transition-hide="fade" transition-duration="200">
    <div class="flex column absolute create-buttons">
      <div class="create-buttons__item upload-file" @click="uploadFile">
        <upload-file-icon />
      </div>
      <div class="create-buttons__item create-folder" @click="createFolder">
        <create-folder-icon />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapActions } from 'vuex'

import CreateFolderIcon from '../icons/actions/CreateFolderIcon'
import UploadFileIcon from '../icons/actions/UploadFileIcon'

export default {
  name: 'CreateButtonsDialogs',

  components: {
    CreateFolderIcon,
    UploadFileIcon,
  },
  // props: {
    // file: { type: Object, default: null },
    // dialog: { type: Boolean, default: false },
  // },
  // data() {
  //   return {
  //     openDialog: false,
  //   }
  // },
  // watch: {
  //   dialog(val) {
  //     this.openDialog = val
  //     if (!val) {
  //       this.changeDialogComponent({ component: '' })
  //     }
  //   },
  // },
  methods: {
    ...mapActions('filesmobile', ['changeDialogComponent']),
    createFolder() {
      this.$emit('closeDialog')
      this.changeDialogComponent({ getComponent: () => { return defineAsyncComponent(() => import('./CreateFolderDialog')) } })
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

.create-folder svg {
  width: 20px;
}
</style>

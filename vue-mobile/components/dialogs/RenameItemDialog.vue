<template>
  <AppDialog
    data-test-id="files-rename-dialog"
    v-model="openDialog"
    :close="cancelDialog"
  >
    <template v-slot:content>
      <div class="q-px-lg q-pb-sm dialog__title-text">
        <span>{{ placeholder }}</span>
      </div>
      <AppDialogInput
          data-test-id="files-rename-name"
          class="q-mx-lg"
          v-model="itemName"
          autofocus
          @keyup.enter.stop="renameItem"
          outlined
      />
    </template>
    <template v-slot:actions>
      <ButtonDialog
          data-test-id="files-rename-submit"
          class="q-mb-sm q-mr-sm"
          :saving="submitDisabled"
          :action="renameItem"
          :label="$t('FILESWEBCLIENT.ACTION_RENAME')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppDialog from "components/common/AppDialog";
import AppDialogInput from 'components/common/AppDialogInput'

import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'RenameItemDialog',
  components: {
    ButtonDialog,
    AppDialogInput,
    AppDialog
  },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  computed: {
    placeholder() {
      return this.file.isFolder ? 'Folder name' : 'File name'
    },
    submitDisabled() {
      return this.saving || this.blockedAfterError
    },
  },
  data() {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false,
      blockedAfterError: false,
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
      if (val) {
        this.itemName = this.file?.name || ''
        this.saving = false
        this.blockedAfterError = false
      }
    },
    itemName() {
      if (this.blockedAfterError) {
        this.blockedAfterError = false
      }
    },
  },
  methods: {
    ...mapActions(useFilesStore, ['asyncRenameItem', 'changeFileName']),
    async renameItem() {
      if (!this.itemName.length || this.submitDisabled) {
        return
      }
      this.saving = true
      const result = await this.asyncRenameItem({
        file: this.file,
        itemName: this.itemName,
      })
      this.saving = false
      if (result) {
        await this.changeFileName(this.itemName)
        this.openDialog = false
        this.$emit('closeDialog')
      } else {
        this.blockedAfterError = true
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

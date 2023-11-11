<template>
  <AppDialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:content>
      <div class="q-px-lg q-pb-sm dialog__title-text">
        <span>{{ placeholder }}</span>
      </div>
      <AppDialogInput
          class="q-mx-lg"
          v-model="itemName"
          autofocus
          @keyup.enter.stop="renameItem"
          outlined
      />
    </template>
    <template v-slot:actions>
      <ButtonDialog
          class="q-mb-sm q-mr-sm"
          :saving="saving"
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
  },
  data() {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false,
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions(useFilesStore, ['asyncRenameItem', 'changeFileName']),
    async renameItem() {
      if (this.itemName.length) {
        if (!this.saving) {
          this.saving = true
          const result = await this.asyncRenameItem({
            file: this.file,
            itemName: this.itemName,
          })
          if (result) {
            await this.changeFileName(this.itemName)
            this.openDialog = false
            this.$emit('closeDialog')
          }
        }
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

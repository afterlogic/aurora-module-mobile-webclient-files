<template>
  <q-dialog v-model="openDialog" @escape-key="cancelDialog">
    <q-card class="q-dialog-size q-pt-md" style="min-width: 300px">
      <q-item>
        <app-dialog-input
            placeholder="File name"
            v-model="itemName"
            :autofocus="true"
            outlined
        />
      </q-item>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="renameItem"
          :label="inscription"
        />
        <button-dialog
          :saving="saving"
          :action="cancelDialog"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import AppDialogInput from 'components/common/AppDialogInput'

import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'RenameItemDialog',
  components: { ButtonDialog, AppDialogInput },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  computed: {
    inscription() {
      return this.file.isFolder ? 'Rename folder' : 'Rename file'
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
    ...mapActions('files', ['asyncRenameItem', 'changeFileName']),
    async renameItem() {
      if (this.itemName.length) {
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
        this.saving = false
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped></style>

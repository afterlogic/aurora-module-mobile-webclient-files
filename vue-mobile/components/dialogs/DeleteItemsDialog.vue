<template>
  <q-dialog v-model="openDialog">
    <q-card class="q-dialog-size q-px-sm">
      <q-card-section>
        <span>{{ title }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="deleteItems"
          :label="$t('COREWEBCLIENT.ACTION_DELETE')"
        />
        <button-dialog
          :saving="saving"
          :action="closeDialog"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'DeleteItemsDialog',
  components: {
    ButtonDialog,
  },
  props: {
    file: {
      type: Object,
      default: null,
    },
    dialog: { type: Boolean, default: false },
  },
  data() {
    return {
      openDialog: false,
      saving: false,
    }
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  computed: {
    ...mapGetters('filesmobile', ['selectedFiles']),
    title() {
      if (this.selectedFiles.length > 1) {
        return this.$tc(
          'FILESWEBCLIENT.CONFIRM_DELETE_ITEMS_PLURAL',
          this.selectedFiles.length
        )
      }
      if (this.file?.isFolder) {
        return this.$t('FILESWEBCLIENT.CONFIRM_DELETE_FOLDERS_PLURAL')
      }
      return this.$t('FILESWEBCLIENT.CONFIRM_DELETE_FILES_PLURAL')
    },
  },
  methods: {
    ...mapActions('filesmobile', ['asyncDeleteItems', 'changeItemsLists', 'selectFile']),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async deleteItems() {
      this.saving = true
      const items = []
      if (this.selectedFiles.length) {
        this.selectedFiles.forEach((file) => {
          items.push({
            Path: file.path,
            Name: file.name,
            IsFolder: file.isFolder,
          })
        })
      } else {
        items.push({
          Path: this.file.path,
          Name: this.file.name,
          IsFolder: this.file.isFolder,
        })
      }
      const result = await this.asyncDeleteItems({ items })
      if (result) {
        await this.changeItemsLists({
          items: this.selectedFiles.length ? this.selectedFiles : [this.file],
        })
        await this.selectFile(null)
        this.$emit('closeDialog')
      }
      this.saving = false
    },
  },
}
</script>

<style scoped></style>

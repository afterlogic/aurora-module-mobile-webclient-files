<template>
  <!-- <app-dialog v-model="openDialog" :close="closeDialog"> -->
  <AppDialog :close="closeDialog">
    <template v-slot:content>
      <div class="dialog__title-text q-ma-lg">
        <span>{{ title }}</span>
      </div>
    </template>
    <template v-slot:actions>
      <ButtonDialog
          class="q-mr-sm q-mb-sm"
          :saving="saving"
          :action="deleteItems"
          :label="$t('COREWEBCLIENT.ACTION_DELETE')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import { SHARING_LEVELS } from '../../enums'
import AppDialog from 'src/components/common/AppDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'DeleteItemsDialog',

  components: {
    ButtonDialog,
    AppDialog,
  },

  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  
  data() {
    return {
      saving: false,
    }
  },
  
  computed: {
    ...mapGetters(useFilesStore, ['selectedFiles']),
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
    ...mapActions(useFilesStore, ['asyncDeleteItems', 'changeItemsLists', 'selectFile']),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async deleteItems() {
      this.saving = true
      const items = []
      if (this.selectedFiles.length > 1) {
        this.selectedFiles.forEach((file) => {
          if (file.sharedWithMeAccess === SHARING_LEVELS.NOACCESS) {
            items.push({
              Path: file.path,
              Name: file.name,
              IsFolder: file.isFolder,
            })
          }
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

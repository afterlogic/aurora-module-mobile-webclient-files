<template>
  <AppDialog data-test-id="files-restore-dialog" :close="closeDialog">
    <template v-slot:content>
      <div class="dialog__title-text q-ma-lg">
        <span>{{ title }}</span>
        <div v-if="originalPaths.length" class="q-mt-md">
          <div v-for="(path, index) in originalPaths" :key="index">{{ path }}</div>
          <div v-if="hasMoreOriginalPaths">...</div>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <ButtonDialog
          data-test-id="files-restore-confirm"
          class="q-mr-sm q-mb-sm"
          :saving="saving"
          :action="restoreItems"
          :label="$t('FILESWEBCLIENT.ACTION_RESTORE')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppDialog from 'src/components/common/AppDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'RestoreItemsDialog',

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
    itemsToRestore() {
      return this.selectedFiles.length ? this.selectedFiles : (this.file ? [this.file] : [])
    },
    title() {
      return this.$tc(
        'FILESWEBCLIENT.CONFIRM_RESTORE_ITEMS_PLURAL',
        this.itemsToRestore.length
      )
    },
    originalPaths() {
      return this.itemsToRestore
        .map((item) => item.trashOriginalPath)
        .filter(Boolean)
        .slice(0, 3)
        .map((path) => `${this.$t('FILESWEBCLIENT.LABEL_PERSONAL_STORAGE')}${path}`)
    },
    hasMoreOriginalPaths() {
      return this.itemsToRestore.filter((item) => item.trashOriginalPath).length > 3
    },
  },
  methods: {
    ...mapActions(useFilesStore, ['asyncRestoreItems', 'changeItemsLists', 'selectFile']),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async restoreItems() {
      this.saving = true
      const names = this.itemsToRestore.map((item) => item.id || item.name).filter(Boolean)
      const result = await this.asyncRestoreItems({ items: names })
      if (result) {
        await this.changeItemsLists({ items: this.itemsToRestore })
        await this.selectFile(null)
        this.$emit('closeDialog')
      }
      this.saving = false
    },
  },
}
</script>

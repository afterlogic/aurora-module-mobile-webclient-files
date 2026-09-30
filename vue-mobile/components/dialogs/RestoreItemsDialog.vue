<template>
  <AppDialog data-test-id="files-restore-dialog" :close="closeDialog">
    <template v-slot:content>
      <div class="dialog__title-text q-ma-lg">
        <span>{{ title }}</span>
        <div v-if="originalPaths.length" class="q-mt-md restore-paths">
          <div
            v-for="(path, index) in originalPaths"
            :key="index"
            class="restore-paths__item"
          >{{ path }}</div>
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
import { STORAGE_TYPES } from '../../enums'

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
    ...mapGetters(useFilesStore, ['selectedFiles', 'storageList']),
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
        .filter((item) => item.trashOriginalPath)
        .slice(0, 3)
        .map((item) => this.getOriginalLocation(item))
    },
    hasMoreOriginalPaths() {
      return this.itemsToRestore.filter((item) => item.trashOriginalPath).length > 3
    },
  },
  methods: {
    ...mapActions(useFilesStore, ['asyncRestoreItems', 'changeItemsLists', 'selectFile']),
    getOriginalLocation(item) {
      const encryptedPrefix = '/.encrypted'
      let type = item.trashOriginalType || STORAGE_TYPES.PERSONAL
      let path = item.trashOriginalPath
      if (type === STORAGE_TYPES.PERSONAL && (path === encryptedPrefix || path.startsWith(encryptedPrefix + '/'))) {
        type = STORAGE_TYPES.ENCRYPTED
        path = path.substring(encryptedPrefix.length)
      }
      const storageName = this.storageList.find((storage) => storage.Type === type)?.DisplayName
        || this.$t('FILESWEBCLIENT.LABEL_PERSONAL_STORAGE')
      return `${storageName}${path}`
    },
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

<style lang="scss" scoped>
.restore-paths {
  &__item {
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}
</style>

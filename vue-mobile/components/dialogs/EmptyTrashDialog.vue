<template>
  <AppDialog data-test-id="files-empty-trash-dialog" :close="closeDialog">
    <template v-slot:title>
      {{ $t('FILESMOBILEWEBCLIENT.ACTION_EMPTY_TRASH') }}
    </template>
    <template v-slot:content>
      <div class="dialog__title-text q-ma-lg">
        <span>{{ $t('FILESMOBILEWEBCLIENT.CONFIRM_EMPTY_TRASH') }}</span>
      </div>
    </template>
    <template v-slot:actions>
      <q-btn
        data-test-id="files-empty-trash-cancel"
        class="q-mr-sm q-mb-sm text-no-wrap"
        no-caps
        flat
        color="primary"
        :label="$t('COREWEBCLIENT.ACTION_CANCEL')"
        @click="closeDialog"
      />
      <ButtonDialog
        data-test-id="files-empty-trash-confirm"
        class="q-mr-sm q-mb-sm"
        :saving="saving"
        :action="emptyTrash"
        :label="$t('COREWEBCLIENT.ACTION_DELETE')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppDialog from 'src/components/common/AppDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'EmptyTrashDialog',

  components: {
    AppDialog,
    ButtonDialog,
  },

  emits: ['closeDialog'],

  data() {
    return {
      saving: false,
    }
  },

  methods: {
    ...mapActions(useFilesStore, ['asyncEmptyTrash']),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async emptyTrash() {
      this.saving = true
      const result = await this.asyncEmptyTrash()
      if (result) {
        this.$emit('closeDialog')
      }
      this.saving = false
    },
  },
}
</script>

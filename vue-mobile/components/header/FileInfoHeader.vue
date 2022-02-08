<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-6">
      <q-btn
        flat
        size="17px"
        color="grey-7"
        round
        dense
        icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>
    <div class="col-6 flex justify-end q-pr-sm">
      <q-btn
        flat
        size="15px"
        color="grey-7"
        round
        dense
        icon="link"
        @click="onPerformAction(actions.createShareableLink)"
      />
      <q-btn
        class="q-ml-sm"
        flat
        size="15px"
        color="grey-7"
        round
        dense
        icon="file_download"
        @click="onPerformAction(actions.download)"
      />
      <q-btn
        class="q-ml-sm"
        flat
        size="15px"
        color="grey-7"
        round
        dense
        icon="delete_outline"
        @click="onPerformAction(actions.delete)"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <q-icon color="grey-7" name="more_vert" />
          </template>
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="onPerformAction(actions.shareWithTeammates)"
            >
              <q-item-section>
                <q-item-label>{{
                  actions.shareWithTeammates.displayName
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onCopyMove(actions.copy)">
              <q-item-section>
                <q-item-label>{{ actions.copy.displayName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="onPerformAction(actions.rename)"
            >
              <q-item-section>
                <q-item-label>{{ actions.rename.displayName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { fileActions } from 'src/utils/files/file-actions'

export default {
  name: 'FileInfoHeader',
  data() {
    return {
      actions: fileActions,
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['filesList']),
  },
  watch: {
    'filesList.length'() {
      this.onPreviousPath()
    },
  },
  methods: {
    ...mapActions('filesmobile', ['changeDialogComponent', 'asyncDownloadFile']),
    onPreviousPath() {
      this.$router.back()
    },
    shareFile() {
      this.changeDialogComponent({ component: 'ShareWithTeammatesDialog' })
    },
    deleteFile() {
      this.changeDialogComponent({ component: 'DeleteItemsDialog' })
    },
    downloadFile() {
      this.asyncDownloadFile()
    },
    onCopyMove(action) {
      this.onPerformAction(action)
      this.onPreviousPath()
    },
    onPerformAction(action) {
      if (action.component) {
        this.changeDialogComponent({ component: action.component })
      } else if (action.method) {
        action.method(this.$store)
      }
    },
  },
}
</script>

<style>
.dropdown-more .q-btn-dropdown__arrow {
  display: none;
}
</style>

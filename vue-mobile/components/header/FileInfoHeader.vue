<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-6">
      <q-btn
        flat
        size="17px"
        color="black"
        round
        dense
        icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>
    <div class="col-6 flex justify-end q-pr-sm">
      <icon-action
          class="q-mr-lg"
          icon="SecureLinkIcon"
          @click="onPerformAction(actions.createShareableLink)"
      />
      <icon-action
          class="q-mr-lg"
          icon="DownloadIcon"
          @click="onPerformAction(actions.download)"
      />
      <icon-action
          class="q-mr-lg"
          icon="DeleteIcon"
          @click="onPerformAction(actions.delete)"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <icon-action class="q-mr-md" icon="MoreIcon" />
          </template>
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="onPerformAction(actions.shareWithTeammates)"
            >
              <icon-action class="q-mr-md" :icon="actions.shareWithTeammates.icon" />
              <q-item-section>
                <q-item-label>{{
                  actions.shareWithTeammates.displayName
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onCopyMove(actions.copy)">
              <icon-action class="q-mr-md" :icon="actions.copy.icon" />
              <q-item-section>
                <q-item-label>{{ actions.copy.displayName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="onPerformAction(actions.rename)"
            >
              <icon-action class="q-mr-md" :icon="actions.rename.icon" />
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
import IconAction from "../common/IconAction";
import { mapActions, mapGetters } from 'vuex'

import { fileActions } from '../../utils/file-actions'

export default {
  name: 'FileInfoHeader',
  components: {
    IconAction
  },
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

<template>
  <q-toolbar style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-2">
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
    <div class="col-10 flex justify-end q-pr-sm">
      <icon-action
          v-if="isShowDecryptAction"
          class="q-mr-lg"
          icon="EncryptIcon"
          @click="onDecrypt()"
      />
      <icon-action
          v-if="isShowAction(actions.createShareableLink)"
          class="q-mr-lg"
          icon="SecureLinkIcon"
          @click="onPerformAction(actions.createShareableLink)"
      />
      <icon-action
          v-if="isShowAction(actions.download)"
          class="q-mr-lg"
          icon="DownloadIcon"
          @click="onPerformAction(actions.download)"
      />
      <icon-action
          v-if="isShowAction(actions.delete)"
          class="q-mr-lg"
          icon="DeleteIcon"
          @click="onPerformAction(actions.delete)"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown v-if="isShowDropdown" :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <icon-action class="q-mr-md" icon="MoreIcon" />
          </template>
          <q-list style="width: 205px; min-height: 55px">
            <q-item
              v-if="isShowAction(actions.shareWithTeammates)"
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
            <q-item
                v-if="isShowAction(actions.shareLeave)"
                clickable
                v-close-popup
                @click="onPerformAction(actions.shareLeave)"
            >
              <icon-action class="q-mr-md" :icon="actions.shareLeave.icon" />
              <q-item-section>
                <q-item-label>{{
                    actions.shareLeave.displayName
                  }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.copy)" clickable v-close-popup @click="onCopyMove(actions.copy)">
              <icon-action class="q-mr-md" :icon="actions.copy.icon" />
              <q-item-section>
                <q-item-label>{{ actions.copy.displayName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.rename)"
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
import eventBus from 'src/event-bus'

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
    ...mapGetters('filesmobile', ['fileList', 'currentFile', 'currentStorage', 'currentPath']),
    isShowDropdown() {
      return this.currentStorage.Type !== 'shared' || this.isShowAction(this.actions.shareLeave)
    },
    isShowDecryptAction() {
      console.log(this.currentFile, 'currentFile')
      if (!this.currentFile) return ''
      return this.currentFile.paranoidKey
    }
  },
  watch: {
    'fileList.length'() {
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
    onDecrypt() {
      eventBus.$emit('CoreMobileWebclient::viewFile', {
        getParentComponent: this.$root._getParentComponent
      })
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
    isShowAction(action) {
      return action.isShowAction(
          action.name,
          [this.currentFile],
          this.currentStorage.Type,
          this.currentPath
      )
    }
  },
}
</script>

<style>
.dropdown-more .q-btn-dropdown__arrow {
  display: none;
}
</style>

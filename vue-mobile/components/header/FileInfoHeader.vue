<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <q-btn icon="chevron_left" @click="onPreviousPath" color="black" flat round dense />
    </div>
    <div class="col app-header__right" v-if="actions">
      <action-icon
          v-if="isShowAction(actions.createShareableLink)"
          class="q-mr-lg"
          icon="SecureLinkIcon"
          @click="onPerformAction(actions.createShareableLink)"
      />
      <action-icon
          v-if="isShowAction(actions.download)"
          class="q-mr-lg"
          icon="DownloadIcon"
          @click="onPerformAction(actions.download)"
      />
      <action-icon
          v-if="isShowAction(actions.delete)"
          class="q-mr-lg"
          icon="DeleteIcon"
          @click="onPerformAction(actions.delete)"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown v-if="isShowDropdown" :menu-offset="[8, -45]" flat unelevated dense>
          <template v-slot:label>
            <action-icon class="q-mr-md" icon="MoreIcon" />
          </template>
          <q-list style="width: 205px; min-height: 55px">
            <q-item
              v-if="isShowAction(actions.shareWithTeammates)"
              clickable
              v-close-popup
              @click="onPerformAction(actions.shareWithTeammates)"
            >
              <action-icon class="q-mr-md" :icon="actions.shareWithTeammates.icon" />
              <q-item-section>
                {{ actions.shareWithTeammates.displayName }}
              </q-item-section>
            </q-item>
            <q-item
                v-if="isShowAction(actions.shareLeave)"
                clickable
                v-close-popup
                @click="onPerformAction(actions.shareLeave)"
            >
              <action-icon class="q-mr-md" :icon="actions.shareLeave.icon" />
              <q-item-section>
                {{ actions.shareLeave.displayName }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.copy)" clickable v-close-popup @click="onCopyMove(actions.copy)">
              <action-icon class="q-mr-md" :icon="actions.copy.icon" />
              <q-item-section>
                {{ actions.copy.displayName }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.rename)"
              clickable
              v-close-popup
              @click="onPerformAction(actions.rename)"
            >
              <action-icon class="q-mr-md" :icon="actions.rename.icon" />
              <q-item-section>
                {{ actions.rename.displayName }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import ActionIcon from '../common/ActionIcon'
import { getFileActions } from '../../utils/file-actions'

export default {
  name: 'FileInfoHeader',
  components: {
    ActionIcon
  },

  mounted() {
    this.actions = getFileActions()
  },
  data() {
    return {
      actions: null,
    }
  },
  computed: {
    ...mapGetters(useFilesStore, [
      'fileList',
      'currentFile',
      'currentStorage',
      'currentPathString'
    ]),
    isShowDropdown() {
      return this.currentStorage.Type !== 'shared' || this.isShowAction(this.actions.shareLeave)
    },
  },
  watch: {
    // 'fileList.length'() {
    //   this.onPreviousPath()
    // },
  },
  methods: {
    ...mapActions(useFilesStore, ['changeDialogComponent', 'asyncDownloadFile']),
    onPreviousPath() {
      this.$router.back()
    },
    // shareFile() {
    //   this.changeDialogComponent({ component: 'ShareWithTeammatesDialog' })
    // },
    // deleteFile() {
    //   this.changeDialogComponent({ component: 'DeleteItemsDialog' })
    // },
    downloadFile() {
      this.asyncDownloadFile()
    },
    onCopyMove(action) {
      this.onPerformAction(action)
      this.onPreviousPath()
    },
    onPerformAction(action) {
      if (action.getComponent) {
        this.changeDialogComponent({ getComponent: action.getComponent})
      } else if (action.component) {
        this.changeDialogComponent({ component: action.component })
      }
      else if (action.method) {
        action.method(this)
      }
    },
    isShowAction(action) {
      return action.isShowAction(
          action.name,
          [this.currentFile],
          this.currentStorage.Type,
          this.currentPathString
      )
    }
  },
}
</script>

<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <AppHeaderButton
        data-test-id="files-view-back"
        icon="chevron_left"
        @click="onPreviousPath"
      />
    </div>
    <div class="col app-header__right" v-if="actions">
      <ActionIcon
          v-if="isShowAction(actions.createShareableLink)"
          data-test-id="files-view-share-link"
          class="q-mr-lg"
          icon="SecureLinkIcon"
          @click="onPerformAction(actions.createShareableLink)"
      />
      <ActionIcon
          v-if="isShowAction(actions.download)"
          data-test-id="files-view-download"
          class="q-mr-lg"
          icon="DownloadIcon"
          @click="onPerformAction(actions.download)"
      />
      <ActionIcon
          v-if="isShowAction(actions.delete)"
          data-test-id="files-view-delete"
          class="q-mr-lg"
          icon="DeleteIcon"
          @click="onPerformAction(actions.delete)"
      />
      <div class="dropdown-more flex justify-center items-center">
        <q-btn-dropdown
          v-if="isShowDropdown"
          data-test-id="files-view-more"
          :menu-offset="[8, -45]"
          flat
          unelevated
          dense
        >
          <template v-slot:label>
            <ActionIcon icon="MoreIcon" />
          </template>
          <q-list style="width: 205px; min-height: 55px">
            <q-item
              v-if="isShowAction(actions.addToFavorites)"
              data-test-id="files-menu-add-favorite"
              clickable
              v-close-popup
              @click="onPerformAction(actions.addToFavorites)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.addToFavorites.icon" />
              <q-item-section>
                {{ $t(actions.addToFavorites.displayNameKey) }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.removeFromFavorites)"
              data-test-id="files-menu-remove-favorite"
              clickable
              v-close-popup
              @click="onPerformAction(actions.removeFromFavorites)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.removeFromFavorites.icon" />
              <q-item-section>
                {{ $t(actions.removeFromFavorites.displayNameKey) }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.shareWithTeammates)"
              data-test-id="files-menu-share"
              clickable
              v-close-popup
              @click="onPerformAction(actions.shareWithTeammates)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.shareWithTeammates.icon" />
              <q-item-section>
                {{ $t(actions.shareWithTeammates.displayNameKey) }}
              </q-item-section>
            </q-item>
            <q-item
                v-if="isShowAction(actions.shareLeave)"
                data-test-id="files-menu-share-leave"
                clickable
                v-close-popup
                @click="onPerformAction(actions.shareLeave)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.shareLeave.icon" />
              <q-item-section>
                {{ $t(actions.shareLeave.displayNameKey) }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.copy)"
              data-test-id="files-menu-copy"
              clickable
              v-close-popup
              @click="onCopyMove(actions.copy)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.copy.icon" />
              <q-item-section>
                {{ $t(actions.copy.displayNameKey) }}
              </q-item-section>
            </q-item>
            <q-item
              v-if="isShowAction(actions.rename)"
              data-test-id="files-menu-rename"
              clickable
              v-close-popup
              @click="onPerformAction(actions.rename)"
            >
              <ActionIcon class="q-mr-md" :icon="actions.rename.icon" />
              <q-item-section>
                {{ $t(actions.rename.displayNameKey) }}
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
import AppHeaderButton from 'src/components/common/AppHeaderButton'
import { getFileActions } from '../../utils/file-actions'

export default {
  name: 'FileInfoHeader',
  components: {
    ActionIcon,
    AppHeaderButton,
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
      return this.currentStorage.Type !== 'shared'
        || this.isShowAction(this.actions.shareLeave)
        || this.isShowAction(this.actions.addToFavorites)
        || this.isShowAction(this.actions.removeFromFavorites)
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

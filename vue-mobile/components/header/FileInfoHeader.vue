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
      <AppHeaderButton
          v-if="isShowAction(actions.createShareableLink)"
          data-test-id="files-view-share-link"
          @click="onPerformAction(actions.createShareableLink)"
      >
        <ActionIcon color="black" icon="SecureLinkIcon" />
      </AppHeaderButton>
      <AppHeaderButton
          v-if="isShowAction(actions.download)"
          data-test-id="files-view-download"
          @click="onPerformAction(actions.download)"
      >
        <ActionIcon color="black" icon="DownloadIcon" />
      </AppHeaderButton>
      <AppHeaderButton
          v-if="isShowAction(actions.restore)"
          data-test-id="files-view-restore"
          @click="onPerformAction(actions.restore)"
      >
        <ActionIcon color="black" icon="RestoreIcon" />
      </AppHeaderButton>
      <AppHeaderButton
          v-if="isShowAction(actions.delete)"
          data-test-id="files-view-delete"
          @click="onPerformAction(actions.delete)"
      >
        <ActionIcon color="black" icon="DeleteIcon" />
      </AppHeaderButton>
      <AppHeaderMoreDropdown
        v-if="isShowDropdown"
        data-test-id="files-view-more"
      >
        <template #label>
          <ActionIcon color="black" icon="MoreIcon" />
        </template>
        <q-list style="width: 205px; min-height: 55px">
          <AppMoreActionContainer
            v-if="isShowAction(actions.addToFavorites)"
            data-test-id="files-menu-add-favorite"
            :action-label="$t(actions.addToFavorites.displayNameKey)"
            @click="onPerformAction(actions.addToFavorites)"
          >
            <ActionIcon :icon="actions.addToFavorites.icon" />
          </AppMoreActionContainer>
          <AppMoreActionContainer
            v-if="isShowAction(actions.removeFromFavorites)"
            data-test-id="files-menu-remove-favorite"
            :action-label="$t(actions.removeFromFavorites.displayNameKey)"
            @click="onPerformAction(actions.removeFromFavorites)"
          >
            <ActionIcon :icon="actions.removeFromFavorites.icon" />
          </AppMoreActionContainer>
          <AppMoreActionContainer
            v-if="isShowAction(actions.shareWithTeammates)"
            data-test-id="files-menu-share"
            :action-label="$t(actions.shareWithTeammates.displayNameKey)"
            @click="onPerformAction(actions.shareWithTeammates)"
          >
            <ActionIcon :icon="actions.shareWithTeammates.icon" />
          </AppMoreActionContainer>
          <AppMoreActionContainer
            v-if="isShowAction(actions.shareLeave)"
            data-test-id="files-menu-share-leave"
            :action-label="$t(actions.shareLeave.displayNameKey)"
            @click="onPerformAction(actions.shareLeave)"
          >
            <ActionIcon :icon="actions.shareLeave.icon" />
          </AppMoreActionContainer>
          <AppMoreActionContainer
            v-if="isShowAction(actions.copy)"
            data-test-id="files-menu-copy"
            :action-label="$t(actions.copy.displayNameKey)"
            @click="onCopyMove(actions.copy)"
          >
            <ActionIcon :icon="actions.copy.icon" />
          </AppMoreActionContainer>
          <AppMoreActionContainer
            v-if="isShowAction(actions.rename)"
            data-test-id="files-menu-rename"
            :action-label="$t(actions.rename.displayNameKey)"
            @click="onPerformAction(actions.rename)"
          >
            <ActionIcon :icon="actions.rename.icon" />
          </AppMoreActionContainer>
        </q-list>
      </AppHeaderMoreDropdown>
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import ActionIcon from '../common/ActionIcon'
import AppHeaderButton from 'src/components/common/AppHeaderButton'
import AppHeaderMoreDropdown from 'src/components/common/AppHeaderMoreDropdown'
import AppMoreActionContainer from 'src/components/common/AppMoreActionContainer'
import { getFileActions } from '../../utils/file-actions'

export default {
  name: 'FileInfoHeader',
  components: {
    ActionIcon,
    AppHeaderButton,
    AppHeaderMoreDropdown,
    AppMoreActionContainer,
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
      if (!this.actions) {
        return false
      }
      return this.isShowAction(this.actions.copy)
        || this.isShowAction(this.actions.rename)
        || this.isShowAction(this.actions.shareWithTeammates)
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

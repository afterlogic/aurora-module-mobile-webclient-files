<template>
  <q-toolbar data-test-id="files-select-header" class="app-header">
    <div class="col app-header__left">
      <AppHeaderButton
        data-test-id="files-select-close"
        icon="close"
        @click="resetSelection"
      />
    </div>
    <div class="col app-header__title" data-test-id="files-select-count">
      {{ `Selected: ${items.length}` }}
    </div>
    <div class="col app-header__right">
      <AppHeaderButton
        v-if="isShowAction(actions.copy)"
        data-test-id="files-select-copy"
        @click="copyItems"
      >
        <ActionIcon
          color="black"
          :icon="actions.copy.icon"
          @click.stop="copyItems"
        />
      </AppHeaderButton>
      <AppHeaderButton
        v-if="isShowAction(actions.restore)"
        data-test-id="files-select-restore"
        @click="onPerformAction(actions.restore)"
      >
        <ActionIcon
          color="black"
          :icon="actions.restore.icon"
          @click.stop="onPerformAction(actions.restore)"
        />
      </AppHeaderButton>
      <div
        v-if="isShowAction(actions.shareLeave) && sharedFiles.length"
        class="flex no-wrap items-center"
      >
        <AppHeaderButton
          data-test-id="files-select-share-leave"
          @click="onPerformAction(actions.shareLeave)"
        >
          <ActionIcon
            color="black"
            :icon="actions.shareLeave.icon"
            @click.stop="onPerformAction(actions.shareLeave)"
          />
        </AppHeaderButton>
        <span>{{ sharedFiles.length }}</span>
      </div>
      <AppHeaderButton
        v-if="isShowAction(actions.delete) && unsharedFiles.length"
        data-test-id="files-select-delete"
        @click="onPerformAction(actions.delete)"
      >
        <ActionIcon
          color="black"
          :icon="actions.delete.icon"
          @click.stop="onPerformAction(actions.delete)"
        />
      </AppHeaderButton>
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import { SHARING_LEVELS } from '../../enums'
import { fileActions } from '../../utils/file-actions'
import ActionIcon from '../common/ActionIcon'
import AppHeaderButton from 'src/components/common/AppHeaderButton'

export default {
  name: 'SelectHeader',

  components: {
    ActionIcon,
    AppHeaderButton,
  },

  props: {
    items: { type: Array, default: () => [], },
  },

  computed: {
    ...mapGetters(useFilesStore, [
      'currentStorage',
      'currentPathString',
    ]),
    unsharedFiles() {
      return this.items.filter( item => item.sharedWithMeAccess === SHARING_LEVELS.NOACCESS )
    },
    sharedFiles() {
      return this.items.filter( item => item.sharedWithMeAccess !== SHARING_LEVELS.NOACCESS )
    },
    actions() {
      return fileActions
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'resetSelectedItems',
      'changeDialogComponent',
      'addCopyItems',
    ]),
    resetSelection() {
      this.resetSelectedItems({ items: this.items })
    },
    copyItems() {
      this.addCopyItems({ items: this.items })
      this.resetSelectedItems({ items: this.items })
    },
    isShowAction(action) {
      return action.isShowAction(
          action.name,
          this.items,
          this.currentStorage.Type,
          this.currentPathString
      )
    },
    onPerformAction(action) {
      if (action.getComponent) {
        this.changeDialogComponent({ getComponent: action.getComponent})
      } else if (action.component) {
        this.changeDialogComponent({ component: action.component })
      } else if (action.method) {
        action.method(this)
      }
    }
  },
}
</script>

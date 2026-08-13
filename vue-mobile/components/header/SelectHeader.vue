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
      <div
        v-if="isShowAction(actions.copy)"
        data-test-id="files-select-copy"
        class="flex items-center"
        role="button"
        tabindex="0"
        @click="copyItems"
        @keydown.enter.prevent="copyItems"
      >
        <AppHeaderButton tabindex="-1">
          <ActionIcon color="black" :icon="actions.copy.icon" />
        </AppHeaderButton>
      </div>
      <div
        v-if="isShowAction(actions.restore)"
        data-test-id="files-select-restore"
        class="flex items-center"
        role="button"
        tabindex="0"
        @click="onPerformAction(actions.restore)"
        @keydown.enter.prevent="onPerformAction(actions.restore)"
      >
        <AppHeaderButton tabindex="-1">
          <ActionIcon color="black" :icon="actions.restore.icon" />
        </AppHeaderButton>
      </div>
      <div
        v-if="isShowAction(actions.shareLeave) && sharedFiles.length"
        class="flex no-wrap items-center"
      >
        <div
          data-test-id="files-select-share-leave"
          class="flex items-center"
          role="button"
          tabindex="0"
          @click="onPerformAction(actions.shareLeave)"
          @keydown.enter.prevent="onPerformAction(actions.shareLeave)"
        >
          <AppHeaderButton tabindex="-1">
            <ActionIcon color="black" :icon="actions.shareLeave.icon" />
          </AppHeaderButton>
        </div>
        <span>{{ sharedFiles.length }}</span>
      </div>
      <div
        v-if="isShowAction(actions.delete) && unsharedFiles.length"
        data-test-id="files-select-delete"
        class="flex items-center"
        role="button"
        tabindex="0"
        @click="onPerformAction(actions.delete)"
        @keydown.enter.prevent="onPerformAction(actions.delete)"
      >
        <AppHeaderButton tabindex="-1">
          <ActionIcon color="black" :icon="actions.delete.icon" />
        </AppHeaderButton>
      </div>
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

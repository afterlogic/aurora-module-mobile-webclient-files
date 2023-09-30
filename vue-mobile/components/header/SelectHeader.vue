<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <q-btn @click="resetSelection" color="black" icon="close" flat round dense />
    </div>
    <div class="col app-header__title">
      {{ `Selected: ${items.length}` }}
    </div>
    <div class="col app-header__right">
      <ActionIcon 
        @click="copyItems"
        class="q-mr-md"
        :icon="actions.copy.icon"
      />
      <div v-if="isShowAction(actions.shareLeave) && sharedFiles.length" class="flex no-wrap">
        <ActionIcon
          class="q-mr-xs"
          @click="onPerformAction(actions.shareLeave)"
          :icon="actions.shareLeave.icon"
        />
        <span class="q-mr-md">{{sharedFiles.length}}</span>
      </div>
      <div v-if="isShowAction(actions.delete) && unsharedFiles.length" class="flex no-wrap">
        <ActionIcon
          class="q-mr-xs"
          @click="onPerformAction(actions.delete)"
          :icon="actions.delete.icon"
        />
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

export default {
  name: 'SelectHeader',

  components: {
    ActionIcon,
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
      }
    }
  },
}
</script>

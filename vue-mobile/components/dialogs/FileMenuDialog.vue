<template>
  <!-- <q-dialog v-model="openDialog" position="bottom"> -->
  <q-dialog data-test-id="files-item-menu" position="bottom">
    <q-card class="menu card-radius" v-if="file">
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="menu__title">{{ file.name }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-list>
        <div v-for="action in actions" :key="action.name">
          <q-item
            v-if="isShowAction(action)"
            class="q-my-sm"
            clickable
          >
            <div
              class="flex full-width"
              :data-test-id="`files-item-menu-${action.name}`"
              @click="performAction(action)"
            >
              <ActionIcon :icon="action.icon" />
              <div class="q-pl-md text-subtitle1 flex items-center">
                <p>{{ $t(action.displayNameKey) }}</p>
              </div>
            </div>
          </q-item>
        </div>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import { getFileActionsList } from '../../utils/file-actions'
import ActionIcon from '../common/ActionIcon'

export default {
  name: 'FileMenuDialog',

  props: {
    // dialog: { type: Boolean, default: false },
    file: { type: Object, default: null },
  },

  components: {
    ActionIcon,
  },

  computed: {
    ...mapGetters(useFilesStore, [
      'currentStorage',
      'currentPathString'
    ]),
    actions() {
      return getFileActionsList(this.file)
    },
  },
  // watch: {
  //   dialog(val) {
  //     this.openDialog = val
  //   },
  // },
  // data() {
  //   return {
  //     openDialog: false,
  //   }
  // },
  methods: {
    performAction(action) {
      this.$emit('dialogAction', action)
    },
    isShowAction(action) {
      return action.isShowAction(
        action.name,
        [this.file],
        this.currentStorage.Type,
        this.currentPathString
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.card-radius {
  border-radius: 22px 22px 0 0;
}
.menu__title {
  word-break: break-all;
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
}
</style>

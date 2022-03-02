<template>
  <q-dialog v-model="openDialog" position="bottom">
    <q-card class="menu card-radius" v-if="file" style="min-height: 301px; overflow: hidden">
      <q-card-section class="row items-center no-wrap" style="min-height: 50px;">
        <div>
          <div class="menu__title">{{ file.name }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-list style="height: 250px" class="scroll">
        <div v-for="fileAction in actions" :key="fileAction.name">
          <q-item
            v-if="
              fileAction.isShowAction(
                fileAction.name,
                [ file ],
                currentStorage.Type,
                currentPath
              )
            "
            class="q-my-sm"
            clickable
          >
            <div class="flex full-width" @click="performAction(fileAction)">
              <icon-action :icon="fileAction.icon" />
              <div class="q-pl-md text-subtitle1 flex items-center">
                <p>{{ fileAction.displayName }}</p>
              </div>
            </div>
          </q-item>
        </div>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import { getFileActionsList } from '../../utils/file-actions'

import IconAction from '../common/IconAction'

export default {
  name: 'FileMenuDialog',
  props: {
    dialog: { type: Boolean, default: false },
    file: { type: Object, default: null },
  },
  components: {
    IconAction,
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage', 'currentPath']),
    actions() {
      return getFileActionsList(this.file)
    },
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  data() {
    return {
      openDialog: false,
    }
  },
  methods: {
    performAction(fileAction) {
      this.$emit('dialogAction', fileAction)
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

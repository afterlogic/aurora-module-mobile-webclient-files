<template>
  <q-btn-dropdown
      :disable="!currentUser"
      flat
      unelevated
      dense
      dropdown-icon="none"
      :ripple="false"
      class="dropdown-status"
      :menu-offset="menuOffset"
      ref="dropdown"
  >
    <template v-slot:label>
      <slot name="label" />
    </template>
    <q-list>
      <q-item clickable dense v-close-popup @click="action(2, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[2] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable dense v-close-popup @click="action(1, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[1] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="!currentFile.paranoidKey" dense clickable v-close-popup @click="action(3, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[3] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable dense v-close-popup @click="action(0, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[0] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script>
import { mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

export default {
  name: "DropdownContactStatus",
  props: {
    action: { type: Function, require: true },
    currentUser: { type: Object, default: null },
    menuOffset: { type: Array, default: [0, 0] },
    statuses: { type: Object, default: null }
  },
  computed: {
    ...mapGetters(useFilesStore, ['currentFile']),
  }
}
</script>

<style>
.dropdown-status .q-btn-dropdown__arrow {
  display: none;
}
.dropdown-status .contact-status {
  text-transform: none !important;
}
</style>

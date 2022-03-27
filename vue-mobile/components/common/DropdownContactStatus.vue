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
      <q-item clickable v-close-popup @click="action(1, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[1] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="action(2, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[2] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="!currentFile.paranoidKey" clickable v-close-popup @click="action(3, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[3] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="action(0, currentUser)">
        <q-item-section>
          <q-item-label>{{ statuses[0] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script>
import PlusIcon from "src/components/common/icons/PlusIcon";
import {mapGetters} from "vuex";
export default {
  name: "DropdownContactStatus",
  props: {
    action: { type: Function, require: true },
    currentUser: { type: Object, default: null },
    menuOffset: { type: Array, default: [0, 0] },
    statuses: { type: Object, default: null }
  },
  components: {
    PlusIcon
  },
  computed: {
    ...mapGetters('filesmobile', ['currentFile']),
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

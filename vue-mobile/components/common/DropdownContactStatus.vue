<template>
  <q-btn-dropdown
      :disable="!currentUser"
      flat
      unelevated
      dense
      dropdown-icon="none"
      :ripple="false"
      ref="dropdown"
  >
    <template v-slot:label>
      <plus-icon
          class="text-center items-center justify-center"
          style="fill: #d0d0d0"
      />
    </template>
    <q-list>
      <q-item clickable v-close-popup @click="selectUser(1)">
        <q-item-section>
          <q-item-label>{{ statuses[1] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="selectUser(2)">
        <q-item-section>
          <q-item-label>{{ statuses[2] }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="selectUser(3)">
        <q-item-section>
          <q-item-label>{{ statuses[3] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script>
import PlusIcon from "src/components/common/icons/PlusIcon";
export default {
  name: "DropdownContactStatus",
  props: {
    selectUser: { type: Function, require: true },
    currentUser: { type: Object, default: null }
  },
  components: {
    PlusIcon
  },
  data: () => ({
    statuses: {
      1: 'read',
      2: 'read/write',
      3: 'r/w/r',
    },
  })
}
</script>

<style scoped>

</style>

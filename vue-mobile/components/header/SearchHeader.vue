<template>
  <div>
    <q-toolbar style="height: 55px; font-size: 16px; padding: 0">
      <q-card-actions align="left" class="col-3">
        <q-btn
          flat
          size="15px"
          color="black"
          round
          dense
          icon="close"
          @click="close"
        />
      </q-card-actions>
      <div class="flex column text-center text-black col-6">
        <span class="text-bold" style="font-size: 17px; margin-top: 5px"
          >Search</span
        >
        <span class="text-caption text-blue-grey-12" style="margin-top: -3px">{{
          currentStorage.DisplayName
        }}</span>
      </div>
      <div class="col-3 flex justify-end q-pr-sm" />
    </q-toolbar>
    <q-toolbar
      class="flex row"
      style="height: 74px; font-size: 16px; padding: 0"
    >
      <q-input
        v-model="text"
        :style="{ height: '48px' }"
        :input-style="{ height: '48px' }"
        placeholder="Search"
        autofocus
        borderless
        outlined
        class="col-12 q-px-md search"
        model-value=""
        debounce="400"
      />
    </q-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SearchHeader',
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage', 'searchText']),
  },
  mounted() {
    this.text = this.searchText
  },
  watch: {
    text() {
      this.search()
    }
  },
  methods: {
    ...mapActions('filesmobile', [
      'asyncGetFiles',
      'changeCurrentHeader',
      'changeSearchText',
    ]),
    async search() {
      this.changeSearchText(this.text)
      const result = await this.asyncGetFiles()
    },
    async close() {
      this.changeSearchText('')
      this.changeCurrentHeader('')
      await this.asyncGetFiles()
    },
  },
}
</script>

<style>
.search .q-field__control {
  height: 48px;
}
</style>

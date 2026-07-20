<template>
  <div>
    <q-toolbar class="app-header search-toolbar">
      <div class="col app-header__left">
        <q-btn
          data-test-id="files-search-close"
          @click="onCloseSearch"
          color="black"
          icon="close"
          flat
          round
          dense
        />
      </div>
      <div class="col-8 app-header__title">
        <span class="app-header__title-main">
          Search
        </span>
        <div class="app-header__title-secondary flex no-wrap justify-center full-width">
          <span>{{ currentStorage.DisplayName }}{{currentPath?.length ? '/' : ''}}</span>
          <div class="flex" style="direction: rtl; overflow: hidden;">
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: -0.3em;">
              i{{currentFolder}}
            </span>
          </div>
        </div>
      </div>
      <div class="col app-header__right"></div>
    </q-toolbar>
    <q-toolbar class="search-toolbar__field">
      <div data-test-id="files-search-input" class="full-width">
        <q-input
          v-model="text"
          placeholder="Search"
          autofocus
          borderless
          outlined
          dense
          class="search-toolbar__input"
          debounce="400"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

export default {
  name: 'SearchHeader',
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapGetters(useFilesStore, [
      'currentStorage',
      'searchText',
      'currentPath',
    ]),
    currentFolder() {
      return !this.currentPath?.length ? '' : this.currentPath.join('/')
    }
  },
  mounted() {
    this.text = this.searchText
  },
  watch: {
    text() {
      this.search()
    },
    searchText(v) {
      this.text = v
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'changeCurrentHeader',
      'changeSearchText'
    ]),
    async search() {
      this.changeSearchText(this.text)
    },
    async onCloseSearch() {
      this.changeSearchText('')
      this.changeCurrentHeader('')
    },
  },
}
</script>

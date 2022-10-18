<template>
  <div>
    <q-toolbar class="app-header search-toolbar">
      <div class="col app-header__left">
        <q-btn @click="onCloseSearch" color="black" icon="close" flat round dense />
      </div>
      <div class="col-8 app-header__title">
        <span class="app-header__title-main">
          Search
        </span>
        <div class="app-header__title-secondary flex no-wrap justify-center full-width">
          <span>{{ currentStorage.DisplayName }}{{currentPath.length ? '/' : ''}}</span>
          <div class="flex" style="direction: rtl; overflow: hidden;">
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: -0.6em;">
              i{{currentFolder}}
            </span>
          </div>
        </div>
      </div>
      <div class="col app-header__right"></div>
    </q-toolbar>
    <q-toolbar class="search-toolbar__field">
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
    ...mapGetters('filesmobile', [
      'currentStorage',
      'searchText',
      'currentPath'
    ]),
    currentFolder() {
      // const paths = this.currentPath.split('/')
      // if (this.currentPath.length > 20) {
      //   if (paths[paths.length - 1].length > 15) {
      //     let lastFolder = paths[paths.length - 1]
      //     return `${this.currentStorage.DisplayName}/.../...${lastFolder.slice(lastFolder.length - 15, lastFolder.length)}`
      //   }
      //   return `${this.currentStorage.DisplayName}/.../${paths[paths.length - 1]}`
      // }
      // return `${this.currentStorage.DisplayName}${this.currentPath}`
      const paths = this.currentPath.split('/')
      if (paths.length < 1) return ''
      return this.currentPath
    }
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
      // 'asyncGetFiles',
      'changeCurrentHeader',
      'changeSearchText'
    ]),
    async search() {
      this.changeSearchText(this.text)
      // const result = await this.asyncGetFiles()
    },
    async onCloseSearch() {
      this.changeSearchText('')
      this.changeCurrentHeader('')
      // await this.asyncGetFiles()
    },
  },
}
</script>

<style scoped>
/* .search .q-field__control {
  height: 48px;
} */
</style>

import { defineStore } from 'pinia'

import state from './state'
import actionsPinia from './actions-pinia'
import gettersPinia from './getters-pinia'

export const useFilesStore = defineStore('FilesStore', {
  state: () => (state()),
  actions: actionsPinia,
  getters: gettersPinia,
})

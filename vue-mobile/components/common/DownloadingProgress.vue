<template>
  <div
    v-if="file"
    class="flex"
    style="flex-direction: column; margin-top: -3px"
  >
    <div class="flex q-px-sm" style="width: 100%">
      <div
        class="progress-bar-line"
        style="background: #6bb856"
        :style="{ width: `${file.percentDownloading}%` }"
      />
    </div>
    <div style="font-size: 12px">
      <span v-if="file.percentDownloading !== 100" style="font-size: 12px">
        {{ file.percentDownloading }}%
      </span>
      <span
        v-if="file.percentDownloading !== 100"
        class="text-primary"
        @click.stop="cancelDownloading()"
      >
        Cancel
      </span>
      <span
        v-if="file.percentDownloading === 100"
        style="color: rgb(76, 175, 80)"
      >
        complete
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'DownloadingProgress',
  props: {
    file: { type: Object, default: null },
  },
  methods: {
    cancelDownloading() {
      if (_.isFunction(this.file.cancelToken)) {
        this.file.cancelToken()
      }
    },
  },
}
</script>

<style scoped></style>

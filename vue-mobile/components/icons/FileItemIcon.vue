<template>
  <component :is="componentName" />
</template>

<script>
import { getPreviewIconName } from '../../utils/common'

import FileIcon from './preview/FileIcon'
import FIleImageIcon from './preview/FIleImageIcon'
import FileLinkIcon from './preview/FileLinkIcon'
import FileLockIcon from './preview/FileLockIcon'
import FIleMediaIcon from './preview/FIleMediaIcon'
import FileTextIcon from './preview/FileTextIcon'
import FileArchiveIcon from './preview/FileArchiveIcon'
import FilePdfIcon from './preview/FilePdfIcon'

export default {
  name: 'FileItemIcon',
  components: {
    FileIcon,
    FIleImageIcon,
    FileLinkIcon,
    FileLockIcon,
    FIleMediaIcon,
    FileTextIcon,
    FileArchiveIcon,
    FilePdfIcon,
  },
  props: {
    fileName: { type: String, required: true },
  },
  computed: {
    componentName() {
      return getPreviewIconName(this.fileName)
    },
  },
}
</script>

<style scoped></style>

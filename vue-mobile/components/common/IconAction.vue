<template>
  <div class="icon-action flex justify-center items-center">
    <component :is="icon" />
  </div>
</template>

<script>
import MoveFolderIcon from 'components/common/icons/actions/MoveFolderIcon'
import SecureLinkIcon from 'components/common/icons/actions/SecureLinkIcon'
import ShareIcon from 'components/common/icons/actions/ShareIcon'
import DownloadIcon from 'components/common/icons/actions/DownloadIcon'
import EditIcon from 'components/common/icons/actions/EditIcon'
import DeleteIcon from 'components/common/icons/actions/DeleteIcon'
export default {
  name: 'IconAction',
  props: {
    icon: { type: String, required: true },
  },
  components: {
    MoveFolderIcon,
    SecureLinkIcon,
    ShareIcon,
    DownloadIcon,
    EditIcon,
    DeleteIcon,
  },
}
</script>

<style scoped>
.icon-action {
  width: 16px;
}
</style>

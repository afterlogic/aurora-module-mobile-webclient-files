<template>
  <div class="icon-action flex justify-center items-center">
    <component :is="icon" />
  </div>
</template>

<script>
import CopyMoveIcon from "../icons/file-actions/CopyMoveIcon";
import DeleteIcon from "../icons/file-actions/DeleteIcon";
import MoreIcon from "../icons/file-actions/MoreIcon";
import RenameIcon from "../icons/file-actions/RenameIcon";
import SecureLinkIcon from "../icons/file-actions/SecureLinkIcon";
import SharingIcon from "../icons/file-actions/SharingIcon";
import DownloadIcon from "../icons/file-actions/DownloadIcon";

export default {
  name: 'IconAction',
  props: {
    icon: { type: String, required: true },
  },
  components: {
    SecureLinkIcon,
    CopyMoveIcon,
    MoreIcon,
    RenameIcon,
    DeleteIcon,
    SharingIcon,
    DownloadIcon
  },
}
</script>

<style scoped>
.icon-action {
  width: 16px;
}
</style>

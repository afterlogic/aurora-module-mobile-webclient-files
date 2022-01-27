<template>
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_228_40)">
      <circle cx="30" cy="30" r="20" fill="white" />
    </g>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M23 22V37C23 38.1046 23.8954 39 25 39H36C37.1046 39 38 38.1046 38 37V27L32 21H24C23.4477 21 23 21.4477 23 22ZM31 22L36 27H31V22Z"
      fill="#469CF8"
    />
    <defs>
      <filter
        id="filter0_d_228_40"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.109804 0 0 0 0 0.521569 0 0 0 0 0.905882 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_228_40"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_228_40"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'UploadFileIcon',
}
</script>

<style scoped></style>

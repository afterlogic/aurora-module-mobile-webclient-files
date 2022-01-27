<template>
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_228_29)">
      <circle cx="30" cy="30" r="20" fill="white" />
    </g>
    <path
      d="M22 35V26V25C22 24.4477 22.4477 24 23 24H27.6972C27.8946 24 28.0877 24.0584 28.2519 24.1679L30.7481 25.8321C30.9123 25.9416 31.1054 26 31.3028 26H37C37.5523 26 38 26.4477 38 27V35C38 35.5523 37.5523 36 37 36H23C22.4477 36 22 35.5523 22 35Z"
      fill="#469CF8"
      stroke="#469CF8"
      stroke-width="3"
    />
    <path d="M30 26H22" stroke="#469CF8" stroke-width="3" />
    <path d="M23 26L27 26" stroke="white" />
    <defs>
      <filter
        id="filter0_d_228_29"
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
          result="effect1_dropShadow_228_29"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_228_29"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'CreateFolderIcon',
}
</script>

<style scoped></style>

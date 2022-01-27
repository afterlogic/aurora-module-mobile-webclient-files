<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_17_1929)">
      <path
        d="M6 13V3.62162V3C6 2.44772 6.44772 2 7 2H11.7015C11.8962 2 12.0868 2.05688 12.2497 2.16365L14.3657 3.55064C14.5286 3.65741 14.7191 3.71429 14.9139 3.71429H21C21.5523 3.71429 22 4.162 22 4.71429V13C22 13.5523 21.5523 14 21 14H7C6.44772 14 6 13.5523 6 13Z"
        fill="#469CF8"
        stroke="#469CF8"
        stroke-width="3"
      />
      <path
        d="M9 9.375L9 7.625L16.5 7.625L16.5 5L20 8.5L16.5 12L16.5 9.375L9 9.375Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_17_1929"
        x="0.5"
        y="0.5"
        width="27"
        height="23"
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
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_17_1929"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_17_1929"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'CopyIcon',
  props: {
    width: { type: Number, default: 28 },
    height: { type: Number, default: 24 },
  },
}
</script>

<style scoped></style>

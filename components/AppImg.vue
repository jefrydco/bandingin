<template>
  <v-img
    v-if="src || lazySrc"
    :src="src"
    :lazy-src="lazySrc"
    :aspect-ratio="aspectRatio"
    :width="width"
    :height="height"
    :alt="alt"
    :color="color"
    :cover="cover"
    :contain="contain"
  >
    <template v-slot:placeholder="">
      <v-layout fill-height="" align-center="" justify-center="" ma-0="">
        <v-progress-circular indeterminate="" color="grey lighten-5" />
      </v-layout>
    </template>
    <slot />
  </v-img>
</template>

<script>
export default {
  name: "AppImg",
  props: {
    src: {
      type: String,
      default: ""
    },
    lazySrc: {
      type: String,
      default: ""
    },
    aspectRatio: {
      type: [String, Number],
      default: null
    },
    width: {
      type: [String, Number],
      default: null
    },
    height: {
      type: [String, Number],
      default: null
    },
    alt: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    cover: {
      type: Boolean,
      default: false
    },
    contain: {
      type: Boolean,
      default: true
    }
  }
};
</script>

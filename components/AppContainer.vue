<template>
  <v-container :fill-height="fillHeight" fluid="" grid-list-xl="">
    <v-layout
      :fill-height="fillHeight"
      row=""
      wrap=""
      align-center=""
      justify-center=""
    >
      <v-flex xs12="" sm8="" md6="" lg4="" xl3="">
        <slot />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "AppContainer",
  props: {
    fillHeight: {
      type: Boolean,
      default: false
    }
  }
};
</script>

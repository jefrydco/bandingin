<template>
  <v-app>
    <v-toolbar app="" dark="" color="primary">
      <v-btn icon="" @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Banding Harga</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid="" grid-list-xl="">
        <v-layout row="" wrap="" align-center="" justify-center="">
          <v-flex xs12="" sm6="" md4="" xl3="">
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

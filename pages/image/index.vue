<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <v-layout row="" wrap="">
        <v-flex xs12="">
          <app-img :src="img" :aspect-ratio="3 / 4" alt="Choosen Image" />
        </v-flex>
      </v-layout>
      <v-layout row="" wrap="" align-center="" justify-space-around="">
        <v-btn icon="" large="" fab="" @click="onRetake">
          <v-icon x-large="">mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon="" large="" fab="" @click="onChoose">
          <v-icon x-large="">mdi-check-circle-outline</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { types } from "~/store";

export default {
  data() {
    return {};
  },
  computed: {
    img: {
      get() {
        return this.$store.state.img;
      },
      set(img) {
        this.$store.commit(types.SET_IMG, img);
      }
    },
    imgLabel: {
      get() {
        return this.$store.state.imgLabel;
      },
      set(imgLabel) {
        this.$store.commit(types.SET_IMG_LABEL, imgLabel);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.img === null) {
        this.$router.replace({ name: "index" });
      }
    },
    onRetake() {
      this.$router.replace({ name: "index" });
    },
    async onChoose() {
      const img = this.img;
      const base64String = img.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );
      this.$axios.setHeader("Content-Type", "application/json", ["post"]);
      try {
        const { responses } = await this.$axios.$post(
          "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB5gwh0vSoNiFCSlRD7X_U032goTVe42ZQ",
          {
            requests: [
              {
                image: {
                  content: base64String
                },
                features: [
                  {
                    type: "LABEL_DETECTION",
                    maxResults: 10
                  }
                ]
              }
            ]
          }
        );
        if (responses.length > 0) {
          const { labelAnnotations } = responses[0];
          console.log("On Image Label Detected", labelAnnotations);
          this.imgLabel = labelAnnotations;
          this.$router.push({ name: "image-result" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

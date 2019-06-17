<template>
  <app-container>
    <v-layout row="" wrap="">
      <v-flex xs12="">
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <app-img :src="img" :aspect-ratio="4 / 3" alt="Choosen Image" />
          </v-flex>
        </v-layout>
        <v-layout row="" wrap="" align-center="" justify-space-around="">
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            icon=""
            large=""
            fab=""
            @click="onRetake"
          >
            <v-icon x-large="">refresh</v-icon>
          </v-btn>
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            icon=""
            large=""
            fab=""
            @click="onChoose"
          >
            <v-icon x-large="">check</v-icon>
          </v-btn>
        </v-layout>
        <v-footer class="v-footer--custom" app="" fixed="" height="auto">
          <v-container fluid="" grid-list-xl="">
            <v-layout row="" wrap="">
              <v-flex xs12="">
                <v-autocomplete
                  v-model="selectedCategory"
                  :items="categories"
                  clearable=""
                  item-text="name"
                  return-object=""
                  label="Kategori"
                  solo-inverted=""
                  flat=""
                  hide-details=""
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-footer>
      </v-flex>
    </v-layout>
  </app-container>
</template>

<script>
import { mapState } from "vuex";
import { types } from "~/store";

export default {
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapState(["categories"]),
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
    },
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(value) {
        this.$store.commit(types.SET_SELECTED_CATEGORY, value);
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
      this.$http.setHeader("Content-Type", "application/json", ["post"]);
      try {
        this.isLoading = true;
        const { responses } = await this.$http.$post(
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
          const translationResult = await Promise.all(
            labelAnnotations.map(async label => {
              const { data } = await this.$http.$post(
                "https://translation.googleapis.com/language/translate/v2?key=AIzaSyB5gwh0vSoNiFCSlRD7X_U032goTVe42ZQ",
                {
                  q: label.description,
                  source: "en",
                  target: "id",
                  format: "text"
                }
              );
              return {
                ...label,
                translations: data.translations
              };
            })
          );
          console.log("Translation Result", translationResult);
          this.imgLabel = translationResult;
          this.$router.push({ name: "image-result" });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

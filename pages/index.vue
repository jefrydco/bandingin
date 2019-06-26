<template>
  <app-container>
    <v-layout row="" wrap="">
      <v-flex xs12="">
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <v-card flat="" dark="" color="black">
              <v-card-text class="pa-0 fill-height mb-3">
                <video
                  id="live-video"
                  ref="liveVideo"
                  width="720"
                  height="540"
                  autoplay=""
                  style="display: none"
                />
                <canvas
                  id="live-canvas"
                  ref="liveCanvas"
                  width="720"
                  height="540"
                />
              </v-card-text>
            </v-card>
            <v-select
              :items="cameras"
              v-model="selectedCamera"
              label="Camera"
              item-text="label"
              item-value="deviceId"
              hide-details=""
              solo=""
              dark=""
              color="black"
            />
          </v-flex>
        </v-layout>
        <v-layout row="" wrap="" align-center="" justify-space-around="">
          <v-btn icon="" large="" fab="" @click="onChooseImage">
            <v-icon x-large="">collections</v-icon>
          </v-btn>
          <v-btn
            icon=""
            large=""
            fab=""
            color="primary"
            @click="onCapture"
          ></v-btn>
          <v-btn icon="" large="" fab="">
            <v-icon x-large="">history</v-icon>
          </v-btn>
        </v-layout>
        <!-- eslint-disable-next-line -->
        <input
          ref="file"
          accept="image/*"
          type="file"
          style="display: none"
          @change="onImageChoosed"
        />
      </v-flex>
    </v-layout>
  </app-container>
</template>

<script>
import isPng from "is-png";
import isJpg from "is-jpg";
import { mapState, mapActions } from "vuex";

import { getImageFromCanvas, drawImage } from "~/utils/canvas";
import { getBase64 } from "~/utils/files";
import { types } from "~/store";
import { types as cameraTypes } from "~/store/camera";

export default {
  data() {
    return {
      camera: null,
      interval: null,
      devices: []
    };
  },
  computed: {
    ...mapState(["categories"]),
    ...mapState("camera", ["cameras"]),
    selectedCamera: {
      get() {
        return this.$store.state.camera.selectedCamera;
      },
      set(selectedCamera) {
        this.$store.commit(
          `camera/${cameraTypes.SET_SELECTED_CAMERA}`,
          selectedCamera
        );
      }
    },
    img: {
      get() {
        return this.$store.state.img;
      },
      set(img) {
        this.$store.commit(types.SET_IMG, img);
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
  watch: {
    selectedCamera(selectedCamera) {
      this.initCamera(selectedCamera);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions("camera", ["startCamera", "stopCamera", "getCameras"]),
    async init() {
      this.initFile();
      await this.getCameras();
      await this.initCamera(this.selectedCamera);
    },
    initFile() {
      this.$refs.file.value = null;
    },
    async initCamera(deviceId) {
      try {
        const videoStream = await this.startCamera(deviceId);
        const video = this.$refs.liveVideo;
        const canvas = this.$refs.liveCanvas;
        const canvasCtx = canvas.getContext("2d");
        video.srcObject = videoStream;

        if (this.interval) {
          clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
          drawImage(canvasCtx, video, 0, 0, 720, 540, { isFlip: true });
        }, 1000 / 60);
      } catch (error) {
        console.log(error);
      }
    },
    async onCapture() {
      const canvas = this.$refs.liveCanvas;
      const image = await getImageFromCanvas(canvas);
      const base64 = await getBase64(image);
      this.img = base64;
      await this.$router.push({ name: "image" });
      // const imgEl = document.createElement("img");
      // imgEl.onload = async () => {
      //   drawImage(ctx, imgEl, 0, 0, 720, 540, {
      //     deg: 0,
      //     isFlip: true,
      //     isFlop: false
      //   });
      //   flippedImg = await getImageFromCanvas(canvas);
      //   const base64 = await getBase64(flippedImg);
      //   this.img = base64;
      //   await this.$router.push({ name: "image" });
      // };
      // imgEl.src = img;
    },
    onChooseImage() {
      this.$refs.file.click();
    },
    async onImageChoosed(event) {
      const file = event.target.files[0];
      const img = await this.getBase64(file);
      this.img = img;
      this.$router.push({ name: "image" });
    },
    isPngOrJpg(file) {
      return new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = event => {
          const buffer = event.target.result;
          const isPngOrJpg =
            isPng(new Uint8Array(buffer)) || isJpg(new Uint8Array(buffer));
          resolve(isPngOrJpg);
        };
      });
    },
    getBase64(file) {
      if (!this.isPngOrJpg(file)) {
        return null;
      }
      return new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = event => {
          resolve(event.target.result);
        };
      });
    }
  }
};
</script>

<style>
video {
  transform: scaleX(-1);
}
</style>

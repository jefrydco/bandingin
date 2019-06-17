<template>
  <app-container>
    <v-layout row="" wrap="">
      <v-flex xs12="">
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <v-card flat="" dark="" color="black">
              <v-card-text class="pa-0 fill-height">
                <no-ssr>
                  <vue-web-cam
                    ref="webcam"
                    :device-id="deviceId"
                    height="100%"
                    width="100%"
                    @started="onStarted"
                    @stopped="onStopped"
                    @error="onError"
                    @cameras="onCameras"
                    @camera-change="onCameraChange"
                  />
                </no-ssr>
              </v-card-text>
            </v-card>
            <v-select
              :items="devices"
              v-model="camera"
              label="Devices"
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
  <!-- <v-container fluid="" grid-list-xl="">
    <v-layout row="" wrap="">
      <v-flex xs12="" sm6="">
        <no-ssr>
          <vue-web-cam
            ref="webcam"
            :device-id="deviceId"
            width="100%"
            @started="onStarted"
            @stopped="onStopped"
            @error="onError"
            @cameras="onCameras"
            @camera-change="onCameraChange"
          />
        </no-ssr>
      </v-flex>
      <v-flex xs12="" sm6="">
        <v-img :src="img" :aspect-ratio="1">
          <template #placeholder="">
            <v-layout fill-height="" align-center="" justify-center="" ma-0="">
              <v-progress-circular indeterminate="" color="grey lighten-5" />
            </v-layout>
          </template>
        </v-img>
      </v-flex>
    </v-layout>
    <v-layout row="" wrap="">
      <v-flex xs12="" sm3="">
        <v-select
          :items="devices"
          v-model="camera"
          label="Devices"
          item-text="label"
          item-value="deviceId"
          box=""
        />
      </v-flex>
      <v-btn @click="onCapture">Capture</v-btn>
      <v-btn @click="onStop">Stop</v-btn>
      <v-btn @click="onStart">Start</v-btn>
    </v-layout>
  </v-container> -->
</template>

<script>
import isPng from "is-png";
import isJpg from "is-jpg";
import { mapState } from "vuex";

import { getImageFromCanvas, drawImage } from "~/utils/canvas";
import { getBase64 } from "~/utils/files";
import { types } from "~/store";

export default {
  data() {
    return {
      camera: null,
      deviceId: null,
      devices: []
    };
  },
  computed: {
    ...mapState(["categories"]),
    device() {
      return this.devices.find(n => n.deviceId === this.deviceId);
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
    camera(id) {
      this.deviceId = id;
    },
    devices(devices) {
      // Once we have a list select the first one
      // eslint-disable-next-line
      const [first, ...tail] = devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initFile();
    },
    initFile() {
      this.$refs.file.value = null;
    },
    onCapture() {
      const img = this.$refs.webcam.capture();
      let flippedImg = null;
      const canvasEl = document.createElement("canvas");
      canvasEl.width = 720;
      canvasEl.height = 540;
      const ctx = canvasEl.getContext("2d");
      const imgEl = document.createElement("img");
      imgEl.onload = async () => {
        drawImage(ctx, imgEl, 0, 0, 720, 540, 0, true, false);
        flippedImg = await getImageFromCanvas(canvasEl);
        const base64 = await getBase64(flippedImg);
        this.img = base64;
        await this.$router.push({ name: "image" });
      };
      imgEl.src = img;
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
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

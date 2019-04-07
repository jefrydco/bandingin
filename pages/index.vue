<template>
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
          <v-icon x-large="">mdi-image</v-icon>
        </v-btn>
        <v-btn
          icon=""
          large=""
          fab=""
          color="primary"
          @click="onCapture"
        ></v-btn>
        <v-btn icon="" large="" fab="">
          <v-icon x-large="">mdi-view-dashboard</v-icon>
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

import { types } from "~/store";

export default {
  data() {
    return {
      // img: "/icon.png",
      camera: null,
      deviceId: null,
      devices: []
    };
  },
  computed: {
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
    }
  },
  watch: {
    // async img(img) {
    //   const base64String = img.replace(
    //     /^data:image\/(png|jpg|jpeg);base64,/,
    //     ""
    //   );
    //   console.log("On Image Changed", base64String);
    //   this.$axios.setHeader("Content-Type", "application/json", ["post"]);
    //   const { responses } = await this.$axios.$post(
    //     "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBjYJmRSSbtHdJZ9HCb5PW26dLyXD41rZw",
    //     {
    //       requests: [
    //         {
    //           image: {
    //             content: base64String
    //           },
    //           features: [
    //             {
    //               type: "LABEL_DETECTION",
    //               maxResults: 3
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   );
    //   console.log("On Image Label Detected", responses);
    // },
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
      this.img = this.$refs.webcam.capture();
      this.$router.push({ name: "image" });
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

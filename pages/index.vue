<template>
  <v-container fluid="" grid-list-xl="">
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      img: "/icon.png",
      camera: null,
      deviceId: null,
      devices: []
    };
  },
  computed: {
    device() {
      return this.devices.find(n => n.deviceId === this.deviceId);
    }
  },
  watch: {
    async img(img) {
      const base64String = img.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );
      console.log("On Image Changed", base64String);
      this.$axios.setHeader("Content-Type", "application/json", ["post"]);
      const { responses } = await this.$axios.$post(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBjYJmRSSbtHdJZ9HCb5PW26dLyXD41rZw",
        {
          requests: [
            {
              image: {
                content: base64String
              },
              features: [
                {
                  type: "LABEL_DETECTION",
                  maxResults: 3
                }
              ]
            }
          ]
        }
      );
      console.log("On Image Label Detected", responses);
    },
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
  methods: {
    onCapture() {
      this.img = this.$refs.webcam.capture();
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
    }
  }
};
</script>

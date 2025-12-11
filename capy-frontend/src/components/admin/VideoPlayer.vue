<script setup>
import "shaka-player/dist/shaka-player.ui.js"; // ensures the UI build is registered
import "shaka-player/dist/controls.css"; // required styling for Shaka controls
import VideoPlayer from "@llamohank/custom-shaka-player";
// import samplevideo from "@/assets/sample.mp4";
const videoPlayerRef = ref(null);
const isLoading = ref(true);
const isError = ref(false);
// let videoWidth = computed(() => videoPlayerRef.value?.videoWidth);
const videoHeight = computed(() => videoPlayerRef.value?.videoHeight);
const videoDuration = computed(() => videoPlayerRef.value?.duration);
let player = null;

const play = async (src) => {
  // await player.play(samplevideo);
  await player.play(src);
  // videoDuration = videoPlayerRef.value.duration;
  console.log(videoHeight.value);
  // videoWidth = videoPlayerRef.value.videoWidth;
  console.log(videoDuration.value);
  // videoHeight = videoPlayerRef.value.videoHeight;
};
const init = async () => {
  player = new VideoPlayer(videoPlayerRef.value, videoPlayerRef.value.parentElement, {
    seekJumpSeconds: 10, // optional, defaults to 10
  });
  await player.initialize();
  // console.log("init");
};
const destroy = () => {
  if (player) {
    player.destroy();
    // console.log("close");
  }
};
defineExpose({
  destroy,
  init,
  play,
  // videoWidth,
  videoHeight,
  videoDuration,
});
</script>
<template>
  <div>
    <div v-if="!isError">
      <div v-show="!isLoading" class="player-shell">
        <video style="width: 100%" ref="videoPlayerRef" muted playsinline></video>
      </div>
      <div
        style="height: 300px; width: 500px"
        v-loading="isLoading"
        element-loading-text="載入中..."
        v-show="isLoading"
      ></div>
    </div>
    <div style="height: 300px; width: 500px" v-if="isError">
      <p>影片播放錯誤</p>
    </div>
  </div>
  <!-- <div>
    <video style="width: 100%" :src="samplevideo"></video>
  </div> -->
</template>
<style scoped>
.player-shell {
  width: 100% !important;
  height: auto;
  margin: 12px 0;
  /* margin-left: -12px; */
}

:deep(#shaka-player-ui-time-container) {
  align-items: center;
}
</style>

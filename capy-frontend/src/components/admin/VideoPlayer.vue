<script setup>
import "shaka-player/dist/shaka-player.ui.js"; // ensures the UI build is registered
import "shaka-player/dist/controls.css"; // required styling for Shaka controls
import VideoPlayer from "@llamohank/custom-shaka-player";
// import samplevideo from "@/assets/sample.mp4";
const videoPlayerRef = ref(null);
// let videoWidth = computed(() => videoPlayerRef.value?.videoWidth);
const videoHeight = computed(() => videoPlayerRef.value?.videoHeight);
const videoDuration = computed(() => videoPlayerRef.value?.duration);
let player = null;
onMounted(async () => {
  init();
  // play();
});

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
  <div class="player-shell">
    <video style="width: 100%" ref="videoPlayerRef" muted playsinline></video>
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

<script setup>
import "shaka-player/dist/shaka-player.ui.js"; // ensures the UI build is registered
import "shaka-player/dist/controls.css"; // required styling for Shaka controls
import VideoPlayer from "@llamohank/custom-shaka-player";
import samplevideo from "@/assets/sample.mp4";
const videoPlayerRef = ref(null);
let videoWidth = computed(() => videoPlayerRef.value?.videoWidth);
let videoHeight = computed(() => videoPlayerRef.value?.videoHeight);
let videoDuration = computed(() => videoPlayerRef.value?.duration);
let player = null;
onMounted(async () => {
  init();
  // play();
});

const play = async (src) => {
  await player.play(samplevideo);
  videoDuration = videoPlayerRef.value.duration;
  videoWidth = videoPlayerRef.value.videoWidth;
  videoHeight = videoPlayerRef.value.videoHeight;
  // await player.play(src);
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
  videoWidth,
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
  margin-left: -12px;
}
</style>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const capybara = ref(null)
const riverPath = ref(null)
let ctx = null

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    if (!capybara.value || !riverPath.value) {
      console.error('Capybara or river path not found')
      return
    }

    ctx = gsap.context(() => {
      gsap.set(capybara.value, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%'
      })

      // Place at path start before scroll drives the timeline
      gsap.set(capybara.value, {
        motionPath: {
          path: riverPath.value,
          align: riverPath.value,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 0
        }
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
          // markers: true
        }
      }).to(capybara.value, {
        duration: 1,
        immediateRender: true,
        motionPath: {
          path: riverPath.value,
          align: riverPath.value,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        },
        ease: 'none'
      })
    }, capybara.value)
  })
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>

<template>
  <div class="scrollytelling-background">
    <svg
      class="river-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(135, 206, 250, 0.4);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgba(135, 206, 250, 0.6);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(135, 206, 250, 0.4);stop-opacity:1" />
        </linearGradient>
      </defs>

      <path
        ref="riverPath"
        d="M 90,5
           Q 80,15 75,20
           Q 65,30 60,35
           Q 50,45 45,50
           Q 35,60 30,65
           Q 20,75 15,80
           Q 10,88 5,95"
        fill="none"
        stroke="url(#riverGradient)"
        stroke-width="15"
        stroke-linecap="round"
        class="river-path"
      />
    </svg>

    <div ref="capybara" class="capybara" aria-label="capybara">
      &#129707;
    </div>
  </div>
</template>

<style scoped>
.scrollytelling-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.river-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.river-path {
  filter: drop-shadow(0 0 30px rgba(135, 206, 250, 0.6));
  animation: river-flow 3s ease-in-out infinite;
}

@keyframes river-flow {
  0%, 100% {
    stroke-width: 15;
    opacity: 0.8;
  }
  50% {
    stroke-width: 18;
    opacity: 1;
  }
}

.capybara {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 56px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  transform-origin: center center;
  will-change: transform;
  z-index: 1;
}

/* Tablet */
@media (max-width: 1024px) {
  .capybara {
    font-size: 42px;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.26));
  }

  .river-path {
    stroke-width: 12;
  }
}

/* Small devices */
@media (max-width: 768px) {
  .scrollytelling-background {
    opacity: 0.6;
  }
  .capybara {
    font-size: 32px;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.24));
  }
  .river-path {
    stroke-width: 8;
    filter: drop-shadow(0 0 18px rgba(135, 206, 250, 0.5));
  }
}
</style>

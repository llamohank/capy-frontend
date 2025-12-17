<template>
  <div class="wishlist-btn" @click.stop="handleClick">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      :fill="isWishlisted ? '#ff4757' : 'none'"
      :stroke="isWishlisted ? '#ff4757' : '#fff'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  </div>
</template>

<script setup>

const props = defineProps({
  isWishlisted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const handleClick = () => {
  emit('toggle')
}
</script>

<style scoped>
.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  z-index: 10;
  /* 使用 will-change 提升性能，並設定 transform-origin */
  will-change: transform;
  transform-origin: center center;
}

.wishlist-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}
</style>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(async () => {
  await userStore.init()
  cartStore.loadFromStorage()
  wishlistStore.loadFromStorage()
})

</script>
<template>
  <RouterView />
</template>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}
</style>

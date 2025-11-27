import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 🔹 登入狀態
  const isLoggedIn = ref(false)

  // 🔹 登入方法
  function login() {
    isLoggedIn.value = true
    localStorage.setItem('loggedIn', 'true')
  }

  // 🔹 登出方法
  function logout() {
    isLoggedIn.value = false
    localStorage.setItem('loggedIn', 'false')
  }

  // 🔹 初始化（可從 localStorage 讀取）
  function init() {
    isLoggedIn.value = localStorage.getItem('loggedIn') === 'true'
  }

  return { isLoggedIn, login, logout, init }
})

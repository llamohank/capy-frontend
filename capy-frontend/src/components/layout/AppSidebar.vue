<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  // 選單項目配置
  menuItems: {
    type: Array,
    required: true
  },
  // Logo 文字
  logoText: {
    type: String,
    default: 'CapyCourse'
  },
  // Logo 短文字（縮合時顯示）
  logoShort: {
    type: String,
    default: 'C'
  },
  // 點擊 Logo 跳轉的路由名稱
  homeRoute: {
    type: String,
    required: true
  }
});

const route = useRoute();

// Sidebar 狀態
const isPinned = ref(false);
const isHovered = ref(false);

// 計算 sidebar 是否展開
const isExpanded = computed(() => isPinned.value || isHovered.value);

// Hover 事件處理
const handleMouseEnter = () => {
  if (!isPinned.value) {
    isHovered.value = true;
  }
};

const handleMouseLeave = () => {
  if (!isPinned.value) {
    isHovered.value = false;
  }
};

// 切換釘選狀態
const togglePin = () => {
  isPinned.value = !isPinned.value;
  if (isPinned.value) {
    isHovered.value = false;
  }
};

// 子選單展開狀態
const expandedMenus = ref([]);

const toggleSubMenu = (menuKey) => {
  const index = expandedMenus.value.indexOf(menuKey);
  if (index > -1) {
    expandedMenus.value.splice(index, 1);
  } else {
    expandedMenus.value.push(menuKey);
  }
};

const isMenuExpanded = (menuKey) => {
  return expandedMenus.value.includes(menuKey);
};

// 檢查路由是否匹配
const isRouteActive = (routeName, extraRoutes = []) => {
  return route.name === routeName || extraRoutes.includes(route.name);
};

const isSubMenuActive = (children) => {
  return children.some(child => isRouteActive(child.route, child.activeRoutes));
};

// 暴露狀態給父組件
defineExpose({
  isPinned,
  isExpanded
});
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'is-expanded': isExpanded }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Logo Header -->
    <router-link :to="{ name: homeRoute }" class="sidebar-header">
      <div class="logo-area">
        <span class="logo-text">{{ logoText }}</span>
        <span class="logo-text-short">{{ logoShort }}</span>
      </div>
    </router-link>

    <!-- Custom Menu -->
    <el-scrollbar class="sidebar-menu-scrollbar">
      <nav class="sidebar-nav">
        <template v-for="item in menuItems" :key="item.route || item.key">
          <!-- 單一選單項 -->
          <router-link
            v-if="item.type === 'item'"
            :to="{ name: item.route }"
            class="nav-item"
            :class="{ 'is-active': isRouteActive(item.route, item.activeRoutes || []) }"
          >
            <el-icon class="nav-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>

          <!-- 子選單 -->
          <div v-else class="nav-submenu" :class="{ 'is-active': isSubMenuActive(item.children) || isRouteActive(null, item.activeRoutes || []) }">
            <div
              class="nav-submenu-title"
              :class="{ 'is-open': isMenuExpanded(item.key) }"
              @click="toggleSubMenu(item.key)"
            >
              <el-icon class="nav-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="nav-label">{{ item.label }}</span>
              <el-icon class="nav-arrow">
                <ArrowDown />
              </el-icon>
            </div>
            <Transition name="submenu">
              <div v-show="isMenuExpanded(item.key) && isExpanded" class="nav-submenu-content">
                <router-link
                  v-for="child in item.children"
                  :key="child.route"
                  :to="{ name: child.route }"
                  class="nav-submenu-item"
                  :class="{ 'is-active': isRouteActive(child.route, child.activeRoutes || []) }"
                >
                  {{ child.label }}
                </router-link>
              </div>
            </Transition>
          </div>
        </template>
      </nav>
    </el-scrollbar>

    <!-- Pin Button -->
    <div class="sidebar-footer">
      <button
        class="pin-btn"
        :class="{ 'is-pinned': isPinned }"
        @click="togglePin"
        :title="isPinned ? '取消釘選' : '釘選側邊欄'"
      >
        <el-icon :size="16">
          <component :is="isPinned ? 'Unlock' : 'Lock'" />
        </el-icon>
        <span class="pin-text">{{ isPinned ? '取消釘選' : '釘選' }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* ==================== Sidebar Container ==================== */
.sidebar {
  width: 64px;
  height: 100vh;
  position: fixed;
  background-color: #1b204bff;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: width 0.2s ease;
  overflow: hidden;
}

.sidebar.is-expanded {
  width: 200px;
}

/* ==================== Logo Header ==================== */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 60px;
}

.sidebar-header:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  position: relative;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #E0E7FF 0%, #A5B4FC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  opacity: 0;
  position: absolute;
  transition: opacity 0.2s ease;
}

.logo-text-short {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #E0E7FF 0%, #A5B4FC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.sidebar.is-expanded .logo-text {
  opacity: 1;
}

.sidebar.is-expanded .logo-text-short {
  opacity: 0;
}

/* ==================== Menu Scrollbar ==================== */
.sidebar-menu-scrollbar {
  flex: 1;
  overflow: hidden;
}

/* ==================== Custom Navigation ==================== */
.sidebar-nav {
  padding: 12px 0;
}

.nav-item,
.nav-submenu-title {
  display: flex;
  align-items: center;
  height: 42px;
  margin: 3px 10px;
  padding: 0 12px;
  border-radius: 8px;
  color: rgba(224, 231, 255, 0.85);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:hover,
.nav-submenu-title:hover {
  background-color: rgba(99, 102, 241, 0.25);
  color: #FFFFFF;
}

.nav-item.is-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(129, 140, 248, 0.2) 100%);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.nav-submenu.is-active > .nav-submenu-title {
  color: #A5B4FC;
}

/* Icon - 固定位置 */
.nav-icon {
  font-size: 18px;
  min-width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Label - 用 opacity 控制 */
.nav-label {
  margin-left: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 14px;
}

.sidebar.is-expanded .nav-label {
  opacity: 1;
}

/* Arrow */
.nav-arrow {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
}

.sidebar.is-expanded .nav-arrow {
  opacity: 1;
}

.nav-submenu-title.is-open .nav-arrow {
  transform: rotate(180deg);
}

/* Submenu Content */
.nav-submenu-content {
  overflow: hidden;
}

.nav-submenu-item {
  display: block;
  padding: 10px 12px 10px 42px;
  margin: 2px 10px;
  border-radius: 6px;
  color: rgba(224, 231, 255, 0.7);
  text-decoration: none;
  font-size: 13px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-submenu-item:hover {
  background-color: rgba(99, 102, 241, 0.2);
  color: #FFFFFF;
}

.nav-submenu-item.is-active {
  color: #A5B4FC;
  background-color: rgba(99, 102, 241, 0.15);
}

/* Submenu Transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* ==================== Sidebar Footer ==================== */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  justify-content: center;
}

.pin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.1);
  color: rgba(224, 231, 255, 0.85);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  width: 100%;
  overflow: hidden;
}

.pin-btn .el-icon {
  flex-shrink: 0;
}

.pin-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  color: #FFFFFF;
  border-color: rgba(99, 102, 241, 0.5);
}

.pin-btn.is-pinned {
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: #FFFFFF;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
}

.pin-btn.is-pinned:hover {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.5);
}

.pin-text {
  white-space: nowrap;
  opacity: 0;
  width: 0;
  transition: opacity 0.2s ease, width 0.2s ease, margin 0.2s ease;
  margin-left: 0;
}

.sidebar.is-expanded .pin-text {
  opacity: 1;
  width: auto;
  margin-left: 8px;
}
</style>

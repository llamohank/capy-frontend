<template>
  <el-header class="explore-header">
    <div class="header-content">
      <!-- Logo -->
      <LogoSection />

      <el-button size="large" class="explore-btn">
        Explore
      </el-button>

      <!-- Search Bar -->
      <SearchBar @search="handleSearch" />

      <!-- Become Teacher Button -->
      <el-button type="success" size="large" class="teacher-btn">
        Become Teacher
      </el-button>
    </div>
  </el-header>
</template>

<script setup>
import LogoSection from '@/components/student/main/LogoSection.vue'
import SearchBar from './FilterDrawer/SearchBar.vue'

const emit = defineEmits(['search'])

const handleSearch = (value) => {
  emit('search', value)
}
</script>

<style lang="scss" scoped>
.explore-header {
  background: linear-gradient(135deg, #a8d5ba 0%, #7ec8a3 100%);
  padding: 0;
  height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @include small-mobile {
    height: 70px;
  }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  gap: 24px;

  @include mobile {
    padding: 0 16px;
    gap: 12px;
  }
}

.teacher-btn {
  flex-shrink: 0;
  border-radius: 24px;
  padding: 12px 28px;
  font-weight: 600;

  @include mobile {
    padding: 12px 16px;
    font-size: 14px;
  }

  @include small-mobile {
    span {
      display: none;
    }

    &::after {
      content: '👨‍🏫';
      font-size: 20px;
    }
  }
}

.explore-btn {
  border: none;
  color: #3B2E2E;
  flex-shrink: 0;
  border-radius: 24px;
  padding: 12px 28px;
  font-weight: 600;
  background-color: #8C6E52;

  &:hover {
    background-color: #A38567;
  }

  &:active {
    background-color: #73563E;
  }
}
</style>

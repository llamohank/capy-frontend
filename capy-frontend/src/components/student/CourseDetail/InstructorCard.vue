<template>
  <div class="instructor-card">
    <h3 class="card-title">講師介紹</h3>
    <div class="instructor-info">
      <el-avatar :size="80" :src="instructor.avatar" class="instructor-avatar" />
      <div class="instructor-details">
        <h4 class="instructor-name">{{ instructor.name }}</h4>
        <p class="instructor-title">{{ instructor.title }}</p>
      </div>
    </div>
    <p class="instructor-bio">{{ instructor.bio }}</p>
    <el-button text type="primary" class="view-profile-btn" @click="handleViewProfile">
      查看講師資料
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  instructor: {
    type: Object,
    required: true
  }
})

/**
 * 處理查看講師資料按鈕點擊
 */
const handleViewProfile = () => {
  if (props.instructor.id) {
    router.push({
      name: 'teacherDetail',
      params: { id: props.instructor.id }
    })
  }
}
</script>

<style lang="scss" scoped>
.instructor-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;

  @include mobile {
    padding: 16px;
  }
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;

  @include mobile {
    margin-bottom: 16px;
    font-size: 18px;
  }
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  @include mobile {
    gap: 12px;
  }
}

.instructor-avatar {
  flex-shrink: 0;

  @include mobile {
    /* 透過深層選擇器調整 Element Plus Avatar 尺寸 */
    width: 60px !important;
    height: 60px !important;

    /* 調整 icon 尺寸以配合縮小的 avatar */
    :deep(.el-icon) {
      font-size: 24px;
    }
  }
}

.instructor-details {
  flex: 1;
}

.instructor-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.instructor-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.instructor-bio {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.view-profile-btn {
  color: #7ec8a3;
  font-weight: 600;
  padding: 0;

  &:hover {
    color: #6bb890;
  }
}
</style>

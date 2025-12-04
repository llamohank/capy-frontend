<script setup>
import { computed } from 'vue'

// 接收從父組件傳來的標籤資料
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

// 後端返回的格式: [{ id, name }]
// 直接使用後端資料，不需要排序（後端已經按熱度排序）
const displayTags = computed(() => props.tags)
</script>

<template>
  <div class="tags-container">
    <button
      v-for="tag in displayTags"
      :key="tag.id"
      class="tag-pill"
    >
      {{ tag.name }}
    </button>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.tag-pill {
  /* Shape - Premium Pill形狀 */
  border-radius: 50px;
  padding: 8px 24px;

  /* High Contrast Base Style */
  background-color: #FFFFFF;
  border: 1px solid var(--capy-primary);
  color: #0277BD;

  /* Typography */
  font-size: var(--capy-font-size-base);
  font-weight: 600;

  /* Subtle Depth */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);

  /* Interaction */
  cursor: pointer;
  transition: all 0.3s ease;

  /* Remove default button styles */
  outline: none;
  font-family: inherit;
}

/* 使用 CSS ::before 自動添加 # 符號 */
.tag-pill::before {
  content: '#';
  margin-right: 4px;
  font-weight: var(--capy-font-weight-medium);
}

/* Hover 狀態 - Premium Interaction */
.tag-pill:hover {
  background-color: var(--capy-primary);
  color: white;
  border-color: var(--capy-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(84, 205, 242, 0.35);
}

/* Active/按下狀態 */
.tag-pill:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tags-container {
    gap: 12px;
  }

  .tag-pill {
    padding: 10px 24px;
    font-size: var(--capy-font-size-sm);
  }
}

@media (max-width: 480px) {
  .tags-container {
    gap: 10px;
  }

  .tag-pill {
    padding: 8px 20px;
    font-size: var(--capy-font-size-xs);
  }
}
</style>

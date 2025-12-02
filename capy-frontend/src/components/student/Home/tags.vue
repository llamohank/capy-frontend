<script setup>
import { ref, computed } from 'vue'

const tagsData = ref([
  { id: 1, name: "Java Basic", hot: 95 },
  { id: 2, name: "Python Basic", hot: 88 },
  { id: 3, name: "JavaScript Basic", hot: 76 },
  { id: 4, name: "SQL Basic", hot: 64 }
])

const sortedTags = computed(() =>
  [...tagsData.value].sort((a, b) => b.hot - a.hot)
)
</script>

<template>
  <div class="tags-container">
    <button
      v-for="tag in sortedTags"
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
  /* Shape - Pill形狀 */
  border-radius: 50px;
  padding: 12px 28px;

  /* Ghost/Outline Style - 預設狀態 */
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--capy-primary);
  color: var(--capy-primary);

  /* Typography */
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);

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

/* Hover 狀態 */
.tag-pill:hover {
  background-color: var(--capy-primary);
  color: white;
  border-color: var(--capy-primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 191, 165, 0.3);
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

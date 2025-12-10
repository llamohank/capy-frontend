<template>
  <div v-if="hasActiveFilters" class="active-filters-bar">
    <span class="filter-label">已選條件:</span>

    <!-- Search Keyword Tag (First) -->
    <el-tag
      v-if="searchKeyword"
      closable
      type="warning"
      effect="light"
      @close="removeKeyword"
      class="filter-tag keyword-tag"
    >
      🔍 關鍵字: {{ searchKeyword }}
    </el-tag>

    <!-- Category Tags -->
    <el-tag
      v-for="category in selectedCategoriesWithNames"
      :key="'cat-' + category.id"
      closable
      @close="removeCategory(category.id)"
      type="primary"
      effect="light"
      class="filter-tag"
    >
      {{ category.name }}
    </el-tag>

    <!-- Tag Tags -->
    <el-tag
      v-for="tag in selectedTags"
      :key="'tag-' + tag"
      closable
      type="success"
      effect="light"
      @close="removeTag(tag)"
      class="filter-tag"
    >
      {{ tag }}
    </el-tag>

    <!-- Rating Filter -->
    <el-tag
      v-if="selectedRating > 0"
      closable
      type="warning"
      effect="light"
      @close="removeRating"
      class="filter-tag rating-tag"
    >
      ⭐️ {{ selectedRating }}.0 up
    </el-tag>

    <!-- Clear All Button -->
    <el-button
      link
      type="danger"
      size="small"
      @click="clearAll"
      class="clear-all-btn"
    >
      清除全部
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  searchKeyword: {
    type: String,
    default: ''
  },
  selectedCategories: {
    type: Array,
    default: () => []
  },
  selectedTags: {
    type: Array,
    default: () => []
  },
  selectedRating: {
    type: Number,
    default: 0
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-keyword', 'remove-category', 'remove-tag', 'remove-rating', 'clear-all'])

// 建立 category ID 到 name 的映射
const buildCategoryMap = () => {
  const map = new Map()
  const traverse = (cats) => {
    cats.forEach(cat => {
      map.set(cat.id, cat.name)
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children)
      }
    })
  }
  traverse(props.categories)
  return map
}

// 將選中的 category IDs 轉換為帶有名稱的物件
const selectedCategoriesWithNames = computed(() => {
  const categoryMap = buildCategoryMap()
  return props.selectedCategories
    .map(id => ({
      id,
      name: categoryMap.get(id) || `分類 ${id}`
    }))
    .filter(cat => cat.name) // 過濾掉找不到名稱的
})

// 檢查是否有任何篩選條件
const hasActiveFilters = computed(() => {
  return props.searchKeyword !== '' ||
         props.selectedCategories.length > 0 ||
         props.selectedTags.length > 0 ||
         props.selectedRating > 0
})

const removeKeyword = () => {
  emit('remove-keyword')
}

const removeCategory = (id) => {
  emit('remove-category', id)
}

const removeTag = (tag) => {
  emit('remove-tag', tag)
}

const removeRating = () => {
  emit('remove-rating')
}

const clearAll = () => {
  emit('clear-all')
}
</script>

<style scoped>
.active-filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--capy-bg-base);
  border-radius: var(--capy-radius-base);
  margin-bottom: 24px;
  border: 1px solid var(--capy-border-lighter);
}

.filter-label {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  font-weight: var(--capy-font-weight-medium);
  margin-right: 4px;
  white-space: nowrap;
}

.filter-tag {
  font-size: var(--capy-font-size-sm);
  border-radius: var(--capy-radius-base);
  transition: all var(--capy-transition-fast);
}

.filter-tag:hover {
  transform: translateY(-1px);
  box-shadow: var(--capy-shadow-sm);
}

/* 覆寫 Element Plus 的 primary tag 顏色 */
.filter-tag.el-tag--primary {
  --el-tag-bg-color: rgba(84, 205, 242, 0.1);
  --el-tag-border-color: var(--capy-primary);
  --el-tag-text-color: var(--capy-primary);
}

.filter-tag.el-tag--primary:hover {
  --el-tag-bg-color: rgba(84, 205, 242, 0.15);
}

.clear-all-btn {
  margin-left: 4px;
  font-weight: var(--capy-font-weight-medium);
}

.clear-all-btn:hover {
  text-decoration: underline;
}

/* RWD */
@media (max-width: 768px) {
  .active-filters-bar {
    padding: 10px 12px;
    margin-bottom: 16px;
  }

  .filter-label {
    font-size: var(--capy-font-size-xs);
  }

  .filter-tag {
    font-size: var(--capy-font-size-xs);
  }
}
</style>

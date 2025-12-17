<template>
  <el-autocomplete
    v-model="searchText"
    :fetch-suggestions="fetchSuggestions"
    placeholder="搜尋課程、標籤或講師..."
    :prefix-icon="Search"
    class="search-input"
    size="large"
    clearable
    :trigger-on-focus="false"
    :debounce="300"
    popper-class="search-autocomplete-popper"
    @select="handleSuggestionSelect"
    @keyup.enter="handleSearch"
  >
    <template #append>
      <el-button :icon="Search" @click="handleSearch" />
    </template>
    <template #default="{ item }">
      <div v-if="item.value === '__no_results__'" class="no-results-item">
        <el-icon class="no-results-icon"><InfoFilled /></el-icon>
        <span class="no-results-text">找不到相關建議，按 Enter 直接搜尋</span>
      </div>
      <div v-else class="autocomplete-item">
        <el-icon class="item-icon"><Search /></el-icon>
        <span class="item-label">{{ item.value }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { getSuggestions } from '@/api/student/explore'

const router = useRouter()
const route = useRoute()
const searchText = ref('')

const emit = defineEmits(['search'])

/**
 * 獲取搜尋建議
 */
const fetchSuggestions = async (queryString, cb) => {
  if (!queryString || queryString.trim().length === 0) {
    cb([])
    return
  }

  try {
    const suggestions = await getSuggestions({
      keyword: queryString.trim(),
      size: 10
    })

    if (!suggestions || suggestions.length === 0) {
      cb([{ value: '__no_results__', disabled: true }])
      return
    }

    const formattedSuggestions = suggestions.map(item => ({ value: item }))
    cb(formattedSuggestions)
  } catch (error) {
    console.error('獲取搜尋建議失敗:', error)
    cb([{ value: '__no_results__', disabled: true }])
  }
}

/**
 * 處理選擇建議
 */
const handleSuggestionSelect = (item) => {
  if (item && item.value) {
    searchText.value = item.value
    handleSearch()
  }
}

/**
 * 處理搜尋
 */
const handleSearch = () => {
  if (!searchText.value || searchText.value.trim() === '') {
    ElMessage.warning('請輸入搜尋關鍵字')
    return
  }

  const keyword = searchText.value.trim()
  
  // 發送事件，讓父組件決定是否要關閉選單等
  emit('search', keyword)

  if (route.path === '/explore') {
    router.push({ path: '/explore', query: { search: keyword } })
  } else {
    router.push({ path: '/explore', query: { search: keyword } })
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  box-shadow: none;
  border: 1px solid var(--capy-border-light);
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  box-shadow: 0 0 0 1px var(--capy-primary);
  border-color: var(--capy-primary);
}

/* 自動完成下拉樣式 */
.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.item-icon {
  color: var(--capy-primary);
  font-size: 16px;
}

.item-label {
  flex: 1;
  font-size: 14px;
  color: var(--capy-text-primary);
}

/* 無結果提示樣式 */
.no-results-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  color: var(--el-text-color-secondary);
  cursor: default;
}

.no-results-icon {
  font-size: 18px;
  color: var(--el-color-info);
}

.no-results-text {
  font-size: 14px;
  font-style: italic;
}
</style>

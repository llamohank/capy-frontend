<template>
  <div class="category-tree-multi">
    <!-- 顯示已選擇的分類 -->
    <div v-if="selectedLabels.length > 0" class="selected-categories">
      <div class="selected-title">已選擇：</div>
      <el-tag
        v-for="label in selectedLabels"
        :key="label"
        closable
        type="success"
        size="small"
        @close="removeCategory(label)"
        class="category-tag"
      >
        {{ label }}
      </el-tag>
    </div>

    <!-- 分類樹狀結構 -->
    <el-tree
      ref="treeRef"
      :data="categories"
      :props="treeProps"
      show-checkbox
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="modelValue"
      @check="handleCheck"
      class="custom-tree"
    >
      <template #default="{ node, data }">
        <span class="tree-node-content">
          <span class="tree-node-label">{{ data.name }}</span>
          <span v-if="data.course_count !== undefined" class="course-count">
            ({{ data.course_count }})
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    required: true,
    // 預期格式: [{ id, name, children: [...], course_count }]
  }
})

const emit = defineEmits(['update:modelValue', 'filter-change'])

const treeRef = ref(null)

// Tree 配置
const treeProps = {
  children: 'children',
  label: 'name'
}

/**
 * 找到節點所屬的根分類 ID
 * @param {number} nodeId - 節點 ID
 * @returns {number|null} - 根分類 ID
 */
const findRootId = (nodeId) => {
  // 遞歸查找函數
  const findInTree = (nodes, targetId, rootId = null) => {
    for (const node of nodes) {
      const currentRootId = rootId || node.id

      if (node.id === targetId) {
        return currentRootId
      }

      if (node.children && node.children.length > 0) {
        const found = findInTree(node.children, targetId, currentRootId)
        if (found) return found
      }
    }
    return null
  }

  return findInTree(props.categories, nodeId)
}

/**
 * 獲取某個根分類下的所有節點 ID
 * @param {number} rootId - 根分類 ID
 * @returns {number[]} - 所有子節點 ID 陣列
 */
const getAllNodeIdsUnderRoot = (rootId) => {
  const ids = []

  const collectIds = (nodes) => {
    for (const node of nodes) {
      ids.push(node.id)
      if (node.children && node.children.length > 0) {
        collectIds(node.children)
      }
    }
  }

  const rootNode = props.categories.find(cat => cat.id === rootId)
  if (rootNode) {
    collectIds([rootNode])
  }

  return ids
}

/**
 * 處理複選框變更事件 - 實現「單一根分類」邏輯
 */
const handleCheck = (currentObj, treeStatus) => {
  if (!treeRef.value) return

  // 1. 找到當前節點所屬的根分類
  const currentRootId = findRootId(currentObj.id)

  if (!currentRootId) return

  // 2. 獲取當前所有已選中的節點
  const allCheckedKeys = treeStatus.checkedKeys

  // 3. 過濾出屬於當前根分類的節點
  const validKeys = allCheckedKeys.filter(key => {
    const keyRootId = findRootId(key)
    return keyRootId === currentRootId
  })

  // 4. 更新樹狀結構的選中狀態
  nextTick(() => {
    treeRef.value.setCheckedKeys(validKeys)

    // 5. 發送更新事件
    emit('update:modelValue', validKeys)

    // 6. 發送過濾變更事件給父組件
    emit('filter-change', {
      category_ids: validKeys
    })
  })
}

/**
 * 建立 ID 到完整路徑標籤的映射
 */
const idToLabelMap = computed(() => {
  const map = new Map()

  const traverse = (nodes, parentLabel = '') => {
    nodes.forEach(node => {
      const fullLabel = parentLabel ? `${parentLabel} > ${node.name}` : node.name
      map.set(node.id, fullLabel)

      if (node.children && node.children.length > 0) {
        traverse(node.children, fullLabel)
      }
    })
  }

  traverse(props.categories)
  return map
})

/**
 * 計算已選擇的分類標籤
 */
const selectedLabels = computed(() => {
  return props.modelValue
    .map(id => idToLabelMap.value.get(id))
    .filter(Boolean)
})

/**
 * 移除分類標籤
 */
const removeCategory = (label) => {
  // 找到對應的 ID
  let idToRemove = null
  for (const [id, mapLabel] of idToLabelMap.value.entries()) {
    if (mapLabel === label) {
      idToRemove = id
      break
    }
  }

  if (idToRemove && treeRef.value) {
    // 取消選中該節點（會自動取消其子節點）
    treeRef.value.setChecked(idToRemove, false, true)

    // 獲取更新後的選中狀態
    const checkedKeys = treeRef.value.getCheckedKeys()
    emit('update:modelValue', checkedKeys)

    // 發送過濾變更事件
    emit('filter-change', {
      category_ids: checkedKeys
    })
  }
}

/**
 * 監聽 modelValue 變化，同步到 tree
 */
watch(() => props.modelValue, (newVal, oldVal) => {
  if (treeRef.value) {
    // 使用 nextTick 確保 DOM 更新後再設置
    nextTick(() => {
      // 強制設置選中的 keys，第二個參數 false 表示不觸發 check 事件
      treeRef.value.setCheckedKeys(newVal || [])
      console.log('CategoryTreeMulti: 同步選中狀態', newVal)
    })
  }
}, { immediate: true, deep: true })

/**
 * 監聽 categories 變化，重置選中狀態
 */
watch(() => props.categories, () => {
  if (treeRef.value && props.modelValue.length > 0) {
    nextTick(() => {
      treeRef.value.setCheckedKeys(props.modelValue)
    })
  }
}, { deep: true })
</script>

<style scoped>
.category-tree-multi {
  width: 100%;
}

/* ==================== 樹狀結構樣式 ==================== */
.custom-tree {
  background: transparent;
  border: none;
}

.custom-tree :deep(.el-tree-node__content) {
  height: 40px;
  padding: 4px 0;
  border-radius: 6px;
  transition: all 0.2s;
}

.custom-tree :deep(.el-tree-node__content:hover) {
  background: #f5f5f5;
}

.custom-tree :deep(.el-checkbox) {
  margin-right: 8px;
}

.custom-tree :deep(.el-checkbox__inner) {
  border-radius: 4px;
}

/* Capy Focus 主題色 - Teal */
.custom-tree :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--capy-primary, #00BFA5);
  border-color: var(--capy-primary, #00BFA5);
}

.custom-tree :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--capy-primary, #00BFA5);
  border-color: var(--capy-primary, #00BFA5);
}

.custom-tree :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

/* ==================== 節點內容樣式 ==================== */
.tree-node-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
}

.tree-node-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  flex: 1;
}

.course-count {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
  margin-left: auto;
}

/* ==================== 展開圖示樣式 ==================== */
.custom-tree :deep(.el-tree-node__expand-icon) {
  color: #909399;
  font-size: 14px;
}

.custom-tree :deep(.el-tree-node__expand-icon.is-leaf) {
  color: transparent;
}

/* ==================== 已選擇的分類標籤區域 ==================== */
.selected-categories {
  margin-bottom: 16px;
  padding: 12px;
  background: #e6fefe;
  border-radius: 8px;
  border: 1px solid var(--el-color-primary-light-7, #b3f8f5);
}

.selected-title {
  font-size: 12px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 8px;
}

.category-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  background: var(--capy-primary, #00BFA5);
  border-color: var(--capy-primary, #00BFA5);
  color: white;
}

.category-tag :deep(.el-tag__close) {
  color: white;
}

.category-tag :deep(.el-tag__close:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

/* ==================== 樹狀結構縮排 ==================== */
.custom-tree :deep(.el-tree-node__children) {
  padding-left: 20px;
}

/* ==================== 第一層節點樣式（根分類）==================== */
.custom-tree :deep(.el-tree > .el-tree-node > .el-tree-node__content .tree-node-label) {
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
}

.custom-tree :deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  background: #fafbfc;
  margin-bottom: 4px;
}

.custom-tree :deep(.el-tree > .el-tree-node > .el-tree-node__content:hover) {
  background: #f0f9f4;
}

/* ==================== 子節點樣式 ==================== */
.custom-tree :deep(.el-tree-node__children .tree-node-label) {
  font-weight: 500;
  color: #606266;
}

.custom-tree :deep(.el-tree-node__children .course-count) {
  color: #a8abb2;
}

/* ==================== Hover 效果增強 ==================== */
.custom-tree :deep(.el-tree-node__content:hover .tree-node-label) {
  color: var(--capy-primary, #00BFA5);
}

.custom-tree :deep(.el-tree-node__content:hover .course-count) {
  color: var(--capy-primary-dark-1, #00ac94);
}
</style>

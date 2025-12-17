<template>
  <div class="search-bar">
    <el-input
      v-model="localSearchQuery"
      placeholder="Search for courses..."
      :prefix-icon="Search"
      size="large"
      clearable
      @input="handleInput"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const localSearchQuery = ref(props.modelValue)

const handleInput = (value) => {
  emit('update:modelValue', value)
  emit('search', value)
}

watch(() => props.modelValue, (newVal) => {
  localSearchQuery.value = newVal
})
</script>

<style lang="scss" scoped>
.search-bar {
  flex: 1;
  max-width: 600px;

  /* RWD */
  @include mobile {
    max-width: none;
  }
}

.search-bar :deep(.el-input__wrapper) {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
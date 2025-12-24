<script setup>
import { CircleClose, CirclePlus } from "@element-plus/icons-vue";
const props = defineProps({
  optionList: {
    required: true,
    type: Array,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
  },
});
const emits = defineEmits(["update:modelValue"]);

const tagPoolList = ref([]);
const syncTagPoolList = () => {
  if (!props.optionList || props.optionList.length === 0) {
    tagPoolList.value = [];
    return;
  }
  tagPoolList.value = props.optionList.map((item) => ({
    ...item,
    active: props.modelValue?.includes(item.id) || false,
  }));
};
watch(
  () => [props.optionList, props.modelValue],
  () => {
    syncTagPoolList();
  },
  { immediate: true, deep: true }
);

const activeList = computed(() => tagPoolList.value?.filter((item) => item.active));
const activeValue = computed(() => activeList.value?.map((item) => item.id));

const toggleActive = (id) => {
  const target = tagPoolList.value?.find((item) => item.id === id);
  if (!target) return;
  if (!target.active && activeList.value.length >= 10) {
    ElMessage.error("最多只能選擇10個標籤");
    return;
  }
  target.active = !target.active;
  emits("update:modelValue", activeValue.value);
};
</script>
<template>
  <div>
    <div class="tagpool">
      <div @click="toggleActive(item.id)" v-for="item in tagPoolList" :key="item.id">
        <el-tag size="large" :type="item.active ? 'primary' : 'info'" effect="plain" round
          ><span style="margin-right: 8px"
            ><el-icon v-if="!item.active"><CircleCheck /></el-icon
            ><el-icon v-else><CircleCheckFilled /></el-icon></span
          >{{ item.name }}</el-tag
        >
      </div>
    </div>
    <p style="font-size: 14px; text-align: end; padding: 4px 4px; color: #a8abb2">
      已選擇 {{ activeList.length }}/10
    </p>
  </div>
</template>
<style scoped>
.tagpool {
  width: 100%;
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 12px;
  min-height: 36px;
}
.tag {
  line-height: 1.5;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  color: #fff;
  /* border: 1px solid #000; */
  background-color: #409eef;
  border-radius: 4px;
  font-weight: 500;
}
.tag:hover {
  cursor: pointer;
  background-color: #f0f3f5;
  color: #409eef;
}
.tip-text {
  text-align: right;
  line-height: 1.5;
  font-size: 14px;
  color: #606266;
}
</style>

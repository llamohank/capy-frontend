<script setup>
const optionlist = ref(null);
const list = [
  {
    name: "aaa",
    id: 1,
  },
  {
    name: "bbb",
    id: 2,
  },
];
onMounted(() => {
  //發請求獲取taglist
  //optionlist.value?.map((item) => ({ ...item, active: false }))
  optionlist.value = list;
});
const active = computed(() => optionlist.value?.filter((item) => item.active));
const inactive = computed(() => optionlist.value?.filter((item) => !item.active));
const becomeActive = (id) => {
  if (active.value.length >= 3) {
    ElMessage.error("已達標籤數量上限");
    return;
  }
  optionlist.value.forEach((item) => {
    if (item.id === id) item.active = true;
  });
};
const becomeInactive = (id) => {
  optionlist.value.forEach((item) => {
    if (item.id === id) item.active = false;
  });
};
defineExpose({ activeList: active.value });
</script>
<template>
  <div>
    <div>
      <div class="tagpool">
        <span class="tag" @click="becomeInactive(item.id)" v-for="item in active" :key="item.id"
          ><el-icon style="margin-right: 8px"><CircleClose /></el-icon>{{ item.name }}</span
        >
      </div>
      <p class="tip-text">已選擇({{ active?.length }}/3)</p>
    </div>
    <p style="margin-bottom: 8px; color: #606266; line-height: 1">所有標籤 :</p>
    <div class="tagpool">
      <span class="tag" @click="becomeActive(item.id)" v-for="item in inactive" :key="item.id"
        ><el-icon style="margin-right: 8px"><CirclePlus /></el-icon>{{ item.name }}</span
      >
    </div>
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
  gap: 8px;
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

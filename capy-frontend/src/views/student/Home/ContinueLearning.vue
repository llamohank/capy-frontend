<script setup>
const jsonData= ref([
  {
    id:1,
    title:'Java Basic',
    img_url:'https://picsum.photos/200',
    percent:60
  },
    {
      id:2,
    title:'Python Basic',
    img_url:'https://picsum.photos/200',
    percent:40
  },  
  {id:3,
    title:'Javascipt Basic',
    img_url:'https://picsum.photos/200',
    percent:22
  },
])
</script>
<template>
  <div class="Ben">
    <el-card v-for="item in jsonData" :key="item.id" style="max-width: 250px">
      <template #header>{{ item.title }}</template>
      <img
        :src="item.img_url"
        style="width: 50%"
      />
      <el-progress :percentage="item.percent" />
    </el-card>
<!-- 
    <el-card style="max-width: 250px">
      <template #header>Yummy hamburger</template>
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        style="width: 50%"
      />
      <el-progress :percentage="50" />
    </el-card> -->
   <!-- <div><button>我的課程</button></div> -->
  </div>
   
</template>
<style>
.Ben{
  display: flex;
    justify-content: center;
    gap: 50px;
  list-style: none;
}
</style>

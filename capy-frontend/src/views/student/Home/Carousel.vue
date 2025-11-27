<template>
  <el-carousel :interval="3000" type="card" height="400px">
    <el-carousel-item v-for="item in images" :key="item.id">
      <img :src="item.url" :alt="`課程 ${item.id}`" class="carousel-img">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { id: 1, url: "https://picsum.photos/id/1015/800/400" },
        { id: 2, url: "https://picsum.photos/id/1016/800/400" },
        { id: 3, url: "https://picsum.photos/id/1018/800/400" },
        { id: 4, url: "https://picsum.photos/id/1020/800/400" }
      ]
    }
  }
}
</script>

<style scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
</style>

<style scoped>
.carousel-wrapper {
  width: 100%;
  /* overflow: hidden;  */
  overflow-x: hidden; 
  margin:20px 0;
  padding: 0;
}

/* .centered-card-carousel {
  width: 80%;
  margin: 0 auto;
} */

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: 100%;
  margin: 0;
  font-size: 2em;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
<template>
  <swiper
    ref="swiperRef"
    :slides-per-view="3"
    :centered-slides="false"
    :space-between="30"
   
    :navigation="true"
    :modules="modules"
    :breakpoints="{
      768: { slidesPerView: 3, spaceBetween: 20 },
      480: { slidesPerView: 1, spaceBetween: 10 }
    }"
    class="mySwiper"
  >
    <swiper-slide v-for="card in cards" :key="card.id">
      <div class="slide-wrapper">
        <div class="image-area">
          <img :src="card.img" alt="https://picsum.photos/200"class="w-full h-full object-cover rounded-lg"/>
        </div>
        <p class="slide-text">{{ card.text }}</p>
        <p class="slide-buy">{{card.buycount }}</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const swiperRef = ref(null);
const modules = [Pagination, Navigation];

const cards =ref ([
  {id: 1 ,img : "https://picsum.photos/200",text:"java" ,buycount:120},
  {id: 2 ,img : "https://picsum.photos/200",text:"python",buycount:100},
  {id: 3 ,img : "https://picsum.photos/200",text:"vue3",buycount:30},
  {id: 4 ,img : "https://picsum.photos/200",text:"Spring Boot",buycount:40}
])
cards.value.sort((a, b) => b.buycount - a.buycount);
  

</script>

<style>
.mySwiper {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  height: 300px;
}

.slide-wrapper {
  width: 100%;
  height:100%;
  text-align: center;
}

.image-area {
  height: 200px;
  background-color: #d3dce6;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  overflow: hidden;
}

.slide-text {
  margin-top: 10px;
  font-size: 18px;
  color: #333;
}
</style>

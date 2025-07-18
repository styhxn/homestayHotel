<template>
  <div class="icon-test">
    <h2>SVG图标测试</h2>
    <div class="icon-grid">
      <div class="icon-item">
        <SvgIcon name="eye" :size="24" />
        <span>eye</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="star" :size="24" />
        <span>star</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="shopping-cart" :size="24" />
        <span>shopping-cart</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="heart" :size="24" />
        <span>heart</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="spinner" :size="24" class="loading-spinner" />
        <span>spinner</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="times" :size="24" />
        <span>times</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="chevron-up" :size="24" />
        <span>chevron-up</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="th-large" :size="24" />
        <span>th-large</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="leaf" :size="24" />
        <span>leaf</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="gift" :size="24" />
        <span>gift</span>
      </div>
      <div class="icon-item">
        <SvgIcon name="palette" :size="24" />
        <span>palette</span>
      </div>
    </div>
    
    <h3>星星评分测试</h3>
    <div class="stars-test">
      <div class="stars">
        <SvgIcon v-for="n in 5" :key="n" name="star" :size="20" :class="{ active: n <= 3 }" />
      </div>
      <span>3星评分</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from './SvgIcon.vue'
</script>

<style scoped>
.icon-test {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.icon-item span {
  font-size: 0.8rem;
  color: #6b7280;
}

.stars-test {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.stars {
  display: flex;
  gap: 0.2rem;
}

.stars .svg-icon {
  color: #d1d5db;
  transition: all 0.3s ease;
  filter: grayscale(100%);
}

.stars .svg-icon.active {
  color: #FFD700;
  filter: grayscale(0%);
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation: loading 1s linear infinite;
}
</style>

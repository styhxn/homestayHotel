<template>
  <div class="products-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>🛍️ 周边产品</h1>
          <p>精选普洱蘑菇庄园特色产品，带走美好回忆</p>
        </div>
      </div>
    </div>

    <!-- 产品分类导航 -->
    <div class="category-nav">
      <div class="container">
        <div class="nav-tabs">
          <button
            v-for="category in categories"
            :key="category.key"
            @click="activeCategory = category.key"
            class="nav-tab"
            :class="{ active: activeCategory === category.key }"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 产品展示区域 -->
    <div class="products-section">
      <div class="container">
        <!-- 茶叶产品 -->
        <div v-if="activeCategory === 'tea'" class="product-grid">
          <div
            v-for="product in teaProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image">
              <div class="image-gallery" v-if="product.gallery && product.gallery.length > 1">
                <img
                  v-for="(img, index) in product.gallery"
                  :key="index"
                  :src="img"
                  :alt="product.name"
                  :class="{ active: index === 0 }"
                  @mouseenter="switchImage($event, product.id)"
                />
              </div>
              <img v-else :src="product.image" :alt="product.name" class="single-image" />
              <div class="product-badge">{{ product.badge }}</div>
              <div v-if="product.gallery && product.gallery.length > 1" class="gallery-indicator">
                <span v-for="(img, index) in product.gallery" :key="index" class="dot" :class="{ active: index === 0 }"></span>
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-actions">
                <button class="btn-primary">立即购买</button>
                <button class="btn-secondary">加入购物车</button>
              </div>
            </div>
          </div>
        </div>

        <!-- IP衍生产品 -->
        <div v-if="activeCategory === 'ip'" class="product-grid">
          <div
            v-for="product in ipProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image">
              <div class="image-gallery" v-if="product.gallery && product.gallery.length > 1">
                <img
                  v-for="(img, index) in product.gallery"
                  :key="index"
                  :src="img"
                  :alt="product.name"
                  :class="{ active: index === 0 }"
                  @mouseenter="switchImage($event, product.id)"
                />
              </div>
              <img v-else :src="product.image" :alt="product.name" class="single-image" />
              <div class="product-badge">{{ product.badge }}</div>
              <div v-if="product.gallery && product.gallery.length > 1" class="gallery-indicator">
                <span v-for="(img, index) in product.gallery" :key="index" class="dot" :class="{ active: index === 0 }"></span>
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-actions">
                <button class="btn-primary">立即购买</button>
                <button class="btn-secondary">加入购物车</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 纪念品 -->
        <div v-if="activeCategory === 'souvenir'" class="product-grid">
          <div
            v-for="product in souvenirProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image">
              <div class="image-gallery" v-if="product.gallery && product.gallery.length > 1">
                <img
                  v-for="(img, index) in product.gallery"
                  :key="index"
                  :src="img"
                  :alt="product.name"
                  :class="{ active: index === 0 }"
                  @mouseenter="switchImage($event, product.id)"
                />
              </div>
              <img v-else :src="product.image" :alt="product.name" class="single-image" />
              <div class="product-badge">{{ product.badge }}</div>
              <div v-if="product.gallery && product.gallery.length > 1" class="gallery-indicator">
                <span v-for="(img, index) in product.gallery" :key="index" class="dot" :class="{ active: index === 0 }"></span>
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-actions">
                <button class="btn-primary">立即购买</button>
                <button class="btn-secondary">加入购物车</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="showDetail" class="product-detail-modal" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProduct?.name }}</h3>
          <button @click="closeDetail" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-image">
            <img :src="selectedProduct?.image" :alt="selectedProduct?.name" />
          </div>
          <div class="detail-info">
            <p class="detail-desc">{{ selectedProduct?.fullDescription }}</p>
            <div class="detail-specs">
              <h4>产品规格</h4>
              <ul>
                <li v-for="spec in selectedProduct?.specs" :key="spec">{{ spec }}</li>
              </ul>
            </div>
            <div class="detail-price">
              <span class="current-price">¥{{ selectedProduct?.price }}</span>
              <span v-if="selectedProduct?.originalPrice" class="original-price">¥{{ selectedProduct?.originalPrice }}</span>
            </div>
            <div class="detail-actions">
              <button class="btn-primary btn-large">立即购买</button>
              <button class="btn-secondary btn-large">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局IP助手 -->
    <!-- <GlobalIPAssistant /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from '@/types/api'
// import GlobalIPAssistant from '../../components/GlobalIPAssistant.vue'

// 响应式数据
const activeCategory = ref('tea')
const showDetail = ref(false)
const selectedProduct = ref<Product | null>(null)

// 产品分类
const categories = [
  { key: 'tea', name: '茶叶产品', icon: 'fas fa-leaf' },
  { key: 'ip', name: 'IP衍生品', icon: 'fas fa-star' },
  { key: 'souvenir', name: '纪念品', icon: 'fas fa-gift' }
]

// 茶叶产品数据
const teaProducts = ref<Product[]>([
  {
    id: 1,
    name: '精品普洱茶饼',
    description: '选用优质大叶种茶叶，传统工艺制作',
    fullDescription: '这款精品普洱茶饼选用云南大叶种茶叶，经过传统工艺精心制作。茶汤红浓明亮，滋味醇厚回甘，具有独特的陈香。适合收藏和日常品饮。茶饼紧压成型，便于储存和运输，越陈越香，具有很高的收藏价值。',
    image: '/src/assets/images/产品/茶饼/茶饼包装.jpg',
    gallery: [
      '/src/assets/images/产品/茶饼/茶饼包装.jpg',
      '/src/assets/images/产品/茶饼/茶饼原料1.jpg',
      '/src/assets/images/产品/茶饼/茶饼原料2.jpg',
      '/src/assets/images/产品/茶饼/茶饼原料3.jpg'
    ],
    price: 168,
    originalPrice: 198,
    badge: '热销',
    specs: ['重量：357g', '年份：2023年', '产地：云南普洱', '包装：棉纸包装', '工艺：传统压制', '保质期：越陈越香']
  },
  {
    id: 2,
    name: '散装普洱茶（一级）',
    description: '新鲜采摘，自然晒干，原汁原味',
    fullDescription: '采用当季新鲜茶叶，经过自然晒干工艺，保持茶叶的原始香味。茶汤清澈，口感清香甘甜，是日常品茶的绝佳选择。茶叶条索紧结，色泽乌润，香气纯正。',
    image: '/src/assets/images/产品/普洱茶/普洱茶1.jpg',
    gallery: [
      '/src/assets/images/产品/普洱茶/普洱茶1.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶2.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶3.jpg'
    ],
    price: 88,
    originalPrice: 108,
    badge: '新品',
    specs: ['重量：250g', '等级：一级', '产地：云南普洱', '包装：密封袋装', '采摘：春茶', '工艺：晒青毛茶']
  },
  {
    id: 3,
    name: '普洱茶精装礼盒',
    description: '精美包装，送礼佳品',
    fullDescription: '精选多款优质普洱茶，配以精美礼盒包装。包含生茶、熟茶各一饼，适合商务送礼或节日馈赠。礼盒设计典雅，内含茶具套装，是茶友收藏和馈赠亲友的理想选择。',
    image: '/src/assets/images/产品/普洱茶/普洱茶包装刀版图.jpg',
    gallery: [
      '/src/assets/images/产品/普洱茶/普洱茶包装刀版图.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶摆放环境展示.jpg'
    ],
    price: 298,
    originalPrice: 358,
    badge: '礼品',
    specs: ['内含：生茶357g + 熟茶357g', '包装：高档礼盒', '产地：云南普洱', '适合：送礼收藏', '附赠：茶具套装', '包装尺寸：30×20×8cm']
  },
  {
    id: 4,
    name: '陈年普洱茶饼（5年陈）',
    description: '5年自然陈化，口感醇厚',
    fullDescription: '经过5年自然陈化的普洱茶饼，茶性温和，口感醇厚甘甜。陈香浓郁，汤色红亮，是普洱茶爱好者的珍藏佳品。',
    image: '/src/assets/images/产品/茶饼/茶饼原料4.jpg',
    gallery: [
      '/src/assets/images/产品/茶饼/茶饼原料4.jpg',
      '/src/assets/images/产品/茶饼/茶饼原料1.jpg'
    ],
    price: 388,
    originalPrice: 458,
    badge: '珍藏',
    specs: ['重量：357g', '年份：2019年', '陈化：5年', '产地：云南普洱', '包装：竹笋壳包装', '特点：陈香浓郁']
  }
])

// IP衍生产品数据
const ipProducts = ref<Product[]>([
  {
    id: 11,
    name: '普普主题帆布包',
    description: '可爱IP形象，实用环保',
    fullDescription: '以普普为主题设计的帆布包，采用优质帆布材料，结实耐用。包包印有可爱的普普形象，既实用又具有纪念意义。容量大，适合日常购物、上学、旅行使用。',
    image: '/src/assets/images/IP形象衍生产品/帆布包/帆布包1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包1.jpg',
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包2.png',
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包3.jpg'
    ],
    price: 58,
    badge: '热销',
    specs: ['材质：优质帆布', '尺寸：35×40×12cm', '设计：普普主题', '特点：环保耐用', '容量：15L', '重量：约300g']
  },
  {
    id: 12,
    name: '茶茶纪念挂坠',
    description: '精美挂坠，随身携带',
    fullDescription: '精致的茶茶主题挂坠，采用优质材料制作。可作为钥匙扣、包包挂饰使用，让茶茶时刻陪伴在您身边。做工精细，色彩鲜艳，是茶茶粉丝的必备单品。',
    image: '/src/assets/images/IP形象衍生产品/挂坠/挂坠1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠1.jpg',
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠2.jpg',
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠展示.jpg'
    ],
    price: 28,
    badge: '新品',
    specs: ['材质：合金+亚克力', '尺寸：5×3×0.5cm', '设计：茶茶形象', '用途：装饰挂件', '重量：约15g', '包装：精美盒装']
  },
  {
    id: 13,
    name: '茶茶主题服装（女款）',
    description: '舒适面料，时尚设计',
    fullDescription: '以茶茶为主题设计的休闲服装，采用舒适透气的面料。印有可爱的茶茶图案，适合日常穿着和旅游纪念。版型修身，做工精细，是茶茶粉丝的时尚选择。',
    image: '/src/assets/images/IP形象衍生产品/衣服/衣服1（女）.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/衣服/衣服1（女）.jpg',
      '/src/assets/images/IP形象衍生产品/衣服/衣服3.png'
    ],
    price: 128,
    originalPrice: 158,
    badge: '限量',
    specs: ['材质：纯棉', '尺寸：S/M/L/XL', '设计：茶茶主题', '颜色：白色/粉色', '版型：修身', '工艺：数码印花']
  },
  {
    id: 14,
    name: '茶茶主题服装（男款）',
    description: '休闲舒适，个性时尚',
    fullDescription: '茶茶主题男款休闲服装，采用优质纯棉面料，透气舒适。简约的茶茶图案设计，适合各种场合穿着，展现个性魅力。',
    image: '/src/assets/images/IP形象衍生产品/衣服/衣服2（男）.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/衣服/衣服2（男）.jpg',
      '/src/assets/images/IP形象衍生产品/衣服/衣服3.png'
    ],
    price: 138,
    originalPrice: 168,
    badge: '新品',
    specs: ['材质：纯棉', '尺寸：M/L/XL/XXL', '设计：茶茶主题', '颜色：黑色/灰色', '版型：宽松', '工艺：丝网印刷']
  },
  {
    id: 15,
    name: '普普定制水杯',
    description: '保温效果好，设计精美',
    fullDescription: '普普主题定制保温杯，采用优质不锈钢内胆，保温效果佳。杯身印有普普可爱形象，是日常使用和收藏的好选择。双层真空设计，保温保冷效果出色。',
    image: '/src/assets/images/IP形象衍生产品/水杯/水杯1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/水杯/水杯1.jpg'
    ],
    price: 88,
    originalPrice: 108,
    badge: '实用',
    specs: ['容量：500ml', '材质：304不锈钢', '保温：6-8小时', '设计：普普主题', '工艺：激光雕刻', '包装：礼盒装']
  },
  {
    id: 16,
    name: '茶茶平板保护套',
    description: '茶茶图案，保护设备',
    fullDescription: '茶茶主题平板电脑保护套，采用优质PU皮革制作。内部有柔软绒布保护，外观印有精美的茶茶图案。支架功能设计，使用便捷。',
    image: '/src/assets/images/IP形象衍生产品/平板/平板外壳1.png',
    gallery: [
      '/src/assets/images/IP形象衍生产品/平板/平板外壳1.png',
      '/src/assets/images/IP形象衍生产品/平板/平板外壳2.png',
      '/src/assets/images/IP形象衍生产品/平板/平板外壳3.png'
    ],
    price: 68,
    badge: '新品',
    specs: ['适用：9.7-10.1寸平板', '材质：PU皮革+绒布', '设计：茶茶主题', '功能：防摔保护+支架', '颜色：多色可选', '工艺：热转印']
  }
])

// 纪念品数据
const souvenirProducts = ref<Product[]>([
  {
    id: 21,
    name: '庄园纪念勋章（金色版）',
    description: '独特设计，收藏价值',
    fullDescription: '普洱蘑菇庄园专属纪念勋章，采用精美工艺制作。勋章图案融合了茶叶和蘑菇元素，具有很高的收藏和纪念价值。金色版本限量发行，更显珍贵。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg'
    ],
    price: 38,
    badge: '限量',
    specs: ['材质：合金镀金', '直径：4cm', '厚度：3mm', '设计：庄园专属', '包装：精美盒装', '限量：1000枚']
  },
  {
    id: 22,
    name: '庄园纪念勋章（银色版）',
    description: '经典设计，典雅大方',
    fullDescription: '普洱蘑菇庄园纪念勋章银色版，设计典雅大方。采用优质合金材料，表面镀银处理，光泽持久。是庄园访客的珍贵纪念品。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg'
    ],
    price: 28,
    badge: '经典',
    specs: ['材质：合金镀银', '直径：4cm', '厚度：3mm', '设计：庄园专属', '包装：绒布袋装', '工艺：压铸成型']
  },
  {
    id: 23,
    name: '庄园纪念勋章（铜色版）',
    description: '复古风格，怀旧情怀',
    fullDescription: '普洱蘑菇庄园纪念勋章铜色版，复古风格设计，充满怀旧情怀。表面做旧处理，展现历史沧桑感，是收藏爱好者的心头好。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg'
    ],
    price: 25,
    badge: '复古',
    specs: ['材质：合金做旧', '直径：4cm', '厚度：3mm', '设计：庄园专属', '包装：牛皮纸袋', '工艺：仿古处理']
  }
])

// 显示产品详情
const showProductDetail = (product: Product) => {
  selectedProduct.value = product
  showDetail.value = true
}

// 关闭产品详情
const closeDetail = () => {
  showDetail.value = false
  selectedProduct.value = null
}

// 图片切换功能
const switchImage = (event: Event, productId: number) => {
  const target = event.target as HTMLImageElement
  const container = target.closest('.product-image')
  if (container) {
    // 移除所有active类
    const images = container.querySelectorAll('.image-gallery img')
    const dots = container.querySelectorAll('.gallery-indicator .dot')

    images.forEach((img, index) => {
      img.classList.remove('active')
      if (dots[index]) {
        dots[index].classList.remove('active')
      }
    })

    // 添加active类到当前图片
    target.classList.add('active')
    const imageIndex = Array.from(images).indexOf(target)
    if (dots[imageIndex]) {
      dots[imageIndex].classList.add('active')
    }
  }
}

onMounted(() => {
  // 页面加载完成后的初始化操作
  console.log('周边产品页面加载完成')
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.header-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* 分类导航 */
.category-nav {
  background: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-tab:hover {
  border-color: #007bff;
  color: #007bff;
  transform: translateY(-2px);
}

.nav-tab.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

/* 产品展示 */
.products-section {
  padding: 40px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.image-gallery {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-gallery img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.image-gallery img.active {
  opacity: 1;
}

.image-gallery img:hover {
  transform: scale(1.05);
}

.single-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .single-image {
  transform: scale(1.05);
}

.gallery-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.gallery-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.gallery-indicator .dot.active {
  background: white;
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff6b6b;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #333;
}

.product-desc {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.product-price {
  margin-bottom: 20px;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  margin-left: 10px;
  text-decoration: line-through;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
}

/* 产品详情弹窗 */
.product-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;
}

.detail-image img {
  width: 100%;
  border-radius: 10px;
}

.detail-desc {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.detail-specs h4 {
  margin-bottom: 10px;
  color: #333;
}

.detail-specs ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.detail-specs li {
  padding: 5px 0;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.detail-price {
  margin-bottom: 30px;
}

.detail-actions {
  display: flex;
  gap: 15px;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-tabs {
    flex-direction: column;
    align-items: center;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;
  }
}
</style>

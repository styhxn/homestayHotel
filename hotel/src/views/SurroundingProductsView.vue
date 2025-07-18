<template>
  <div class="page-container fade-in">
    <AppNavbar />
    <main class="main-content">
      <!-- 现代化产品页面头部 -->
      <section class="products-hero">
        <div class="hero-background">
          <div class="hero-carousel">
            <div class="hero-slide active" style="background-image: url('/src/assets/images/产品/茶饼/茶饼包装.jpg')">
              <div class="slide-overlay"></div>
            </div>
          </div>
        </div>
        
        <div class="hero-content">
          <div class="hero-badge slide-in-left">
            <span class="badge-icon">🛍️</span>
            <span class="badge-text">庄园精选</span>
          </div>
          <h1 class="hero-title fade-in-up">
            <span class="title-main gradient-text">周边产品</span>
            <span class="title-sub">精选云南特色好物</span>
          </h1>
          <p class="hero-subtitle slide-in-right">
            带走庄园的美好回忆<br>
            <span class="subtitle-highlight">每一件都承载着普洱茶乡的文化底蕴</span>
          </p>

          <div class="hero-buttons fade-in-up">
            <button @click="scrollToProducts" class="btn btn-primary btn-large glowing">
              <span class="btn-text">立即选购</span>
            </button>
            <button @click="scrollToCategories" class="btn btn-outline-white btn-large">
              <span class="btn-text">浏览分类</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 分类导航 -->
      <section class="category-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">产品分类</h2>
            <p class="section-subtitle">精心分类，便于您的选择</p>
          </div>
          
          <div class="category-grid">
            <div 
              v-for="category in categories" 
              :key="category.id"
              @click="activeCategory = category.id"
              class="category-card"
              :class="{ active: activeCategory === category.id }"
            >
              <div class="category-icon">
                <SvgIcon :name="getCategoryIconName(category.icon)" :size="28" />
              </div>
              <div class="category-content">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-desc">{{ category.description }}</p>
                <div class="category-count">{{ category.count }}+ 产品</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特色推荐产品 -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot"></span>
              <span>精选推荐</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">特色推荐</span>
              <span class="title-main">庄园精选，品质保证</span>
            </h2>
          </div>

          <div class="featured-showcase">
            <div
              v-for="product in featuredProducts"
              :key="product.id"
              class="featured-card"
              @click="showProductDetail(product)"
            >
              <div class="product-image-container">
                <div class="product-image">
                  <img :src="product.image" :alt="product.name">
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <button class="quick-view-btn">
                        <SvgIcon name="eye" :size="16" />
                        快速查看
                      </button>
                    </div>
                  </div>
                </div>
                <div class="product-badge" :class="getBadgeClass(product.badge)">
                  {{ product.badge }}
                </div>
                <div class="product-rating">
                  <div class="stars">
                    <SvgIcon v-for="n in 5" :key="n" name="star" :size="14" :class="{ active: n <= (product.rating || 5) }" />
                  </div>
                  <span class="rating-text">{{ product.rating || 5 }}</span>
                </div>
              </div>

              <div class="product-content">
                <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
                <h3 class="product-title">{{ product.name }}</h3>
                <p class="product-desc">{{ product.description }}</p>

                <div class="product-specs" v-if="product.specs">
                  <span v-for="spec in product.specs.slice(0, 2)" :key="spec" class="spec-tag">
                    {{ spec }}
                  </span>
                </div>

                <div class="product-footer">
                  <div class="product-price">
                    <span class="current-price">¥{{ product.price }}</span>
                    <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
                    <span v-if="product.originalPrice" class="discount">
                      省¥{{ product.originalPrice - product.price }}
                    </span>
                  </div>
                  <div class="product-actions">
                    <button @click.stop="handleAddToCartClick($event, product)" class="btn-cart">
                      <SvgIcon name="shopping-cart" :size="16" />
                    </button>
                    <button @click.stop="handleBuyNowClick($event, product)" class="btn-buy">
                      立即购买
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品展示区域 -->
      <section class="products-section">
        <div class="products-background">
          <div class="products-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">全部产品</h2>
            <div class="products-filter">
              <div class="filter-tabs">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="activeCategory = category.id"
                  class="filter-tab"
                  :class="{ active: activeCategory === category.id }"
                >
                  <SvgIcon :name="getCategoryIconName(category.icon)" :size="20" />
                  {{ category.name }}
                  <span class="count">{{ getProductCount(category.id) }}</span>
                </button>
              </div>
              <div class="filter-sort">
                <select v-model="sortBy" class="sort-select">
                  <option value="default">默认排序</option>
                  <option value="price-low">价格从低到高</option>
                  <option value="price-high">价格从高到低</option>
                  <option value="rating">评分最高</option>
                  <option value="newest">最新上架</option>
                </select>
              </div>
            </div>
          </div>

          <div class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card modern-card"
              @click="showProductDetail(product)"
            >
              <div class="product-image-wrapper">
                <div class="product-image">
                  <img :src="product.image" :alt="product.name" />
                  <div class="image-overlay">
                    <div class="overlay-actions">
                      <button @click.stop="handleQuickView(product)" class="action-btn quick-view">
                        <SvgIcon name="eye" :size="18" />
                        <span class="tooltip">快速查看</span>
                      </button>
                      <button @click.stop="handleAddToCartClick($event, product)" class="action-btn add-cart">
                        <SvgIcon name="shopping-cart" :size="18" />
                        <span class="tooltip">加入购物车</span>
                      </button>
                      <button @click.stop="handleWishlist(product)" class="action-btn wishlist">
                        <SvgIcon name="heart" :size="18" />
                        <span class="tooltip">收藏</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 产品标签 -->
                <div v-if="product.badge" class="product-badges">
                  <span class="badge" :class="getBadgeClass(product.badge)">{{ product.badge }}</span>
                  <span v-if="product.isNew" class="badge badge-new">新品</span>
                  <span v-if="product.isHot" class="badge badge-hot">热销</span>
                </div>

                <!-- 产品评分 -->
                <div class="product-rating-overlay">
                  <div class="stars">
                    <SvgIcon v-for="n in 5" :key="n" name="star" :size="14" :class="{ active: n <= (product.rating || 5) }" />
                  </div>
                  <span class="rating-score">{{ product.rating || 5 }}</span>
                </div>
              </div>

              <div class="product-content">
                <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-description">{{ product.description }}</p>

                <!-- 产品特性标签 -->
                <div class="product-tags" v-if="product.tags">
                  <span v-for="tag in product.tags.slice(0, 3)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>

                <div class="product-footer">
                  <div class="price-section">
                    <div class="price-main">
                      <span class="current-price">¥{{ product.price }}</span>
                      <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
                    </div>
                    <div v-if="product.originalPrice" class="discount-info">
                      <span class="discount-percent">
                        {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
                      </span>
                    </div>
                  </div>

                  <div class="product-actions">
                    <button @click.stop="handleBuyNowClick($event, product)" class="btn-buy-now">
                      立即购买
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载更多按钮 -->
          <div class="load-more-section" v-if="hasMoreProducts">
            <button @click="loadMoreProducts" class="btn btn-outline btn-large load-more-btn" :disabled="loading">
              <span v-if="!loading">加载更多产品</span>
              <span v-else class="loading-content">
                <SvgIcon name="spinner" :size="16" class="loading-spinner" />
                加载中...
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 产品详情弹窗 -->
    <div v-if="showDetail" class="product-detail-modal" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProduct?.name }}</h3>
          <button @click="closeDetail" class="close-btn">
            <SvgIcon name="times" :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-image">
            <div class="image-gallery" v-if="selectedProduct?.gallery && selectedProduct.gallery.length > 1">
              <img
                v-for="(img, index) in selectedProduct.gallery"
                :key="index"
                :src="img"
                :alt="selectedProduct.name"
                :class="{ active: index === 0 }"
                @click="switchDetailImage($event)"
              />
            </div>
            <img v-else :src="selectedProduct?.image" :alt="selectedProduct?.name" />
          </div>
          <div class="detail-info">
            <p class="detail-desc">{{ selectedProduct?.fullDescription || selectedProduct?.description }}</p>
            <div class="detail-specs" v-if="selectedProduct?.specs">
              <h4>产品规格</h4>
              <ul>
                <li v-for="spec in selectedProduct.specs" :key="spec">{{ spec }}</li>
              </ul>
            </div>
            <div class="detail-rating">
              <div class="stars">
                <SvgIcon v-for="i in 5" :key="i" name="star" :size="16" :class="{ active: i <= (selectedProduct?.rating || 0) }" />
              </div>
              <span class="rating-text">({{ selectedProduct?.reviews || 0 }}条评价)</span>
            </div>
            <div class="detail-price">
              <span class="current-price">¥{{ selectedProduct?.price }}</span>
              <span v-if="selectedProduct?.originalPrice" class="original-price">¥{{ selectedProduct?.originalPrice }}</span>
            </div>
            <div class="detail-actions">
              <button @click="selectedProduct && handleBuyNowClick($event, selectedProduct)" class="btn-primary btn-large">立即购买</button>
              <button @click="selectedProduct && handleAddToCartClick($event, selectedProduct)" class="btn-secondary btn-large">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动到顶部按钮 -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn floating"
      title="回到顶部"
    >
      <SvgIcon name="chevron-up" :size="24" />
    </button>

    <!-- 购物车组件 -->
    <ShoppingCart />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import AppNavbar from '../components/AppNavbar.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import SvgIcon from '../components/SvgIcon.vue'
import type { Product } from '@/types/api'

// 响应式数据
const router = useRouter()
const auth = useAuthStore()
const cartStore = useCartStore()
const activeCategory = ref('all')
const showDetail = ref(false)
const selectedProduct = ref<Product | null>(null)
const sortBy = ref('default')
const loading = ref(false)
const currentPage = ref(1)
const productsPerPage = 12
const showScrollTop = ref(false)

// 产品分类
const categories = ref([
  {
    id: 'all',
    name: '全部产品',
    icon: 'fas fa-th-large',
    description: '浏览所有庄园产品',
    count: 15
  },
  {
    id: 'tea',
    name: '茶叶产品',
    icon: 'fas fa-leaf',
    description: '精选普洱茶系列',
    count: 4
  },
  {
    id: 'ip',
    name: 'IP衍生品',
    icon: 'fas fa-star',
    description: '普普主题周边',
    count: 6
  },
  {
    id: 'souvenir',
    name: '纪念品',
    icon: 'fas fa-gift',
    description: '庄园专属纪念',
    count: 3
  },
  {
    id: 'craft',
    name: '手工艺品',
    icon: 'fas fa-palette',
    description: '传统手工制作',
    count: 2
  }
])

// 产品数据
const allProducts = ref<Product[]>([
  // 茶叶产品系列
  {
    id: 1,
    name: '精品普洱茶饼',
    description: '选用优质大叶种茶叶，传统工艺制作',
    fullDescription: '这款精品普洱茶饼选用云南大叶种茶叶，经过传统工艺精心制作。茶汤红浓明亮，滋味醇厚回甘，具有独特的陈香。适合收藏和日常品饮。',
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
    categoryId: 'tea',
    rating: 5,
    reviews: 234,
    specs: ['重量：357g', '年份：2023年', '产地：云南普洱', '包装：棉纸包装'],
    tags: ['有机', '传统工艺', '收藏级']
  },
  {
    id: 2,
    name: '散装普洱茶（一级）',
    description: '新鲜采摘，自然晒干，原汁原味',
    fullDescription: '采用当季新鲜茶叶，经过自然晒干工艺，保持茶叶的原始香味。茶汤清澈，口感清香甘甜，是日常品茶的绝佳选择。',
    image: '/src/assets/images/产品/普洱茶/普洱茶1.jpg',
    gallery: [
      '/src/assets/images/产品/普洱茶/普洱茶1.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶2.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶3.jpg'
    ],
    price: 88,
    originalPrice: 108,
    badge: '新品',
    categoryId: 'tea',
    rating: 4,
    reviews: 156,
    specs: ['重量：250g', '等级：一级', '产地：云南普洱', '包装：密封袋装'],
    tags: ['新鲜', '自然', '日常品饮']
  },
  {
    id: 3,
    name: '普洱茶精装礼盒',
    description: '精美包装，送礼佳品',
    fullDescription: '精选多款优质普洱茶，配以精美礼盒包装。包含生茶、熟茶各一饼，适合商务送礼或节日馈赠。',
    image: '/src/assets/images/产品/普洱茶/普洱茶包装刀版图.jpg',
    gallery: [
      '/src/assets/images/产品/普洱茶/普洱茶包装刀版图.jpg',
      '/src/assets/images/产品/普洱茶/普洱茶摆放环境展示.jpg'
    ],
    price: 298,
    originalPrice: 358,
    badge: '礼品',
    categoryId: 'tea',
    rating: 5,
    reviews: 67,
    specs: ['内含：生茶357g + 熟茶357g', '包装：高档礼盒', '产地：云南普洱', '适合：送礼收藏'],
    tags: ['礼盒装', '送礼', '高档']
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
    categoryId: 'tea',
    rating: 5,
    reviews: 234,
    specs: ['重量：357g', '年份：2019年', '陈化：5年', '产地：云南普洱'],
    tags: ['陈年', '珍藏', '限量']
  },

  // IP衍生产品系列
  {
    id: 11,
    name: '茶茶主题帆布包',
    description: '可爱IP形象，实用环保',
    fullDescription: '以茶茶为主题设计的帆布包，采用优质帆布材料，结实耐用。包包印有可爱的茶茶形象，既实用又具有纪念意义。',
    image: '/src/assets/images/IP形象衍生产品/帆布包/帆布包1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包1.jpg',
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包2.png',
      '/src/assets/images/IP形象衍生产品/帆布包/帆布包3.jpg'
    ],
    price: 58,
    badge: '新品',
    categoryId: 'ip',
    rating: 5,
    reviews: 45,
    specs: ['材质：优质帆布', '尺寸：35×40×12cm', '设计：茶茶主题', '容量：15L'],
    tags: ['环保', '实用', 'IP周边'],
    isNew: true
  },
  {
    id: 12,
    name: '茶茶纪念挂坠',
    description: '精美挂坠，随身携带',
    fullDescription: '精致的茶茶主题挂坠，采用优质材料制作。可作为钥匙扣、包包挂饰使用，让茶茶时刻陪伴在您身边。',
    image: '/src/assets/images/IP形象衍生产品/挂坠/挂坠1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠1.jpg',
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠2.jpg',
      '/src/assets/images/IP形象衍生产品/挂坠/挂坠展示.jpg'
    ],
    price: 28,
    badge: '新品',
    categoryId: 'ip',
    rating: 4,
    reviews: 89,
    specs: ['材质：合金+亚克力', '尺寸：5×3×0.5cm', '设计：茶茶形象', '用途：装饰挂件'],
    tags: ['挂饰', '可爱', 'IP周边']
  },
  {
    id: 13,
    name: '普普主题水杯',
    description: '精美陶瓷杯，品茶首选',
    fullDescription: '以普普为主题设计的陶瓷水杯，采用优质陶瓷材料，杯身印有精美的普普图案。容量适中，是品茶和日常使用的理想选择。',
    image: '/src/assets/images/IP形象衍生产品/水杯/水杯1.jpg',
    price: 38,
    badge: '实用',
    categoryId: 'ip',
    rating: 4,
    reviews: 156,
    specs: ['材质：优质陶瓷', '容量：350ml', '设计：普普主题', '工艺：高温烧制'],
    tags: ['陶瓷', '实用', 'IP周边']
  },
  {
    id: 14,
    name: '茶茶主题服装（女款）',
    description: '舒适面料，时尚设计',
    fullDescription: '以茶茶为主题设计的休闲服装，采用舒适透气的面料。印有可爱的茶茶图案，适合日常穿着和旅游纪念。',
    image: '/src/assets/images/IP形象衍生产品/衣服/衣服1（女）.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/衣服/衣服1（女）.jpg',
      '/src/assets/images/IP形象衍生产品/衣服/衣服3.png'
    ],
    price: 128,
    originalPrice: 158,
    badge: '限量',
    categoryId: 'ip',
    rating: 5,
    reviews: 67,
    specs: ['材质：纯棉', '尺寸：S/M/L/XL', '设计：茶茶主题', '颜色：白色/粉色'],
    tags: ['服装', '舒适', 'IP周边']
  },
  {
    id: 15,
    name: '茶茶主题服装（男款）',
    description: '简约设计，舒适穿着',
    fullDescription: '茶茶主题男款休闲服装，简约而不失个性的设计。采用优质面料，穿着舒适，是茶茶粉丝的必备单品。',
    image: '/src/assets/images/IP形象衍生产品/衣服/衣服2（男）.jpg',
    price: 118,
    originalPrice: 148,
    badge: '热销',
    categoryId: 'ip',
    rating: 4,
    reviews: 89,
    specs: ['材质：纯棉', '尺寸：S/M/L/XL/XXL', '设计：茶茶主题', '颜色：黑色/灰色'],
    tags: ['服装', '简约', 'IP周边']
  },
  {
    id: 16,
    name: '茶茶平板保护套',
    description: '茶茶图案，保护设备',
    fullDescription: '茶茶主题平板电脑保护套，采用优质PU皮革制作。内部有柔软绒布保护，外观印有精美的茶茶图案。',
    image: '/src/assets/images/IP形象衍生产品/平板/平板外壳1.png',
    gallery: [
      '/src/assets/images/IP形象衍生产品/平板/平板外壳1.png',
      '/src/assets/images/IP形象衍生产品/平板/平板外壳2.png',
      '/src/assets/images/IP形象衍生产品/平板/平板外壳3.png'
    ],
    price: 68,
    badge: '新品',
    categoryId: 'ip',
    rating: 5,
    reviews: 234,
    specs: ['适用：9.7-10.1寸平板', '材质：PU皮革+绒布', '设计：茶茶主题', '功能：防摔保护'],
    tags: ['保护套', '实用', 'IP周边']
  },

  // 纪念品系列
  {
    id: 21,
    name: '庄园纪念勋章（金色版）',
    description: '庄园专属纪念，限量发售',
    fullDescription: '普洱蘑菇庄园专属纪念勋章，采用精美工艺制作。金色版本限量发售，具有很高的收藏和纪念价值。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg'
    ],
    price: 38,
    badge: '限量',
    categoryId: 'souvenir',
    rating: 5,
    reviews: 67,
    specs: ['材质：合金镀金', '直径：4cm', '设计：庄园专属', '限量：1000枚'],
    tags: ['纪念品', '限量', '收藏']
  },
  {
    id: 22,
    name: '庄园纪念勋章（银色版）',
    description: '经典设计，典雅大方',
    fullDescription: '普洱蘑菇庄园纪念勋章银色版，设计典雅大方。采用优质合金材料，表面镀银处理，光泽持久。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章2.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg'
    ],
    price: 28,
    badge: '经典',
    categoryId: 'souvenir',
    rating: 4,
    reviews: 123,
    specs: ['材质：合金镀银', '直径：4cm', '设计：庄园专属', '工艺：压铸成型'],
    tags: ['纪念品', '经典', '收藏']
  },
  {
    id: 23,
    name: '庄园纪念勋章（铜色版）',
    description: '复古风格，怀旧情怀',
    fullDescription: '普洱蘑菇庄园纪念勋章铜色版，复古风格设计，充满怀旧情怀。表面做旧处理，展现历史沧桑感。',
    image: '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg',
    gallery: [
      '/src/assets/images/IP形象衍生产品/勋章/勋章3.jpg',
      '/src/assets/images/IP形象衍生产品/勋章/勋章1.jpg'
    ],
    price: 25,
    badge: '复古',
    categoryId: 'souvenir',
    rating: 4,
    reviews: 67,
    specs: ['材质：合金做旧', '直径：4cm', '设计：庄园专属', '工艺：仿古处理'],
    tags: ['纪念品', '复古', '收藏']
  }
])

// 计算属性
const filteredProducts = computed(() => {
  let products = activeCategory.value === 'all'
    ? allProducts.value
    : allProducts.value.filter((product: Product) => product.categoryId === activeCategory.value)

  // 排序
  if (sortBy.value === 'price-low') {
    products = products.sort((a: Product, b: Product) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    products = products.sort((a: Product, b: Product) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    products = products.sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
  }

  // 分页显示
  const endIndex = currentPage.value * productsPerPage
  return products.slice(0, endIndex)
})

// 检查是否还有更多产品
const hasMoreProducts = computed(() => {
  const totalProducts = activeCategory.value === 'all'
    ? allProducts.value.length
    : allProducts.value.filter((product: any) => product.categoryId === activeCategory.value).length

  return currentPage.value * productsPerPage < totalProducts
})

// 加载更多产品
const loadMoreProducts = () => {
  loading.value = true
  setTimeout(() => {
    currentPage.value++
    loading.value = false
  }, 1000)
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

// 特色推荐产品
const featuredProducts = computed(() => {
  return allProducts.value.filter((product: Product) =>
    ['热销', '新品', '限量', '珍藏'].includes(product.badge || '')
  ).slice(0, 3)
})

// 获取分类名称
const getCategoryName = (categoryId?: string) => {
  if (!categoryId) return '其他'
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : '其他'
}

// 转换Font Awesome图标类名到SVG图标名称
const getCategoryIconName = (iconClass: string) => {
  const iconMap: { [key: string]: string } = {
    'fas fa-th-large': 'th-large',
    'fas fa-leaf': 'leaf',
    'fas fa-star': 'star',
    'fas fa-gift': 'gift',
    'fas fa-palette': 'palette'
  }
  return iconMap[iconClass] || 'th-large'
}

// 获取产品数量
const getProductCount = (categoryId: string) => {
  if (categoryId === 'all') return allProducts.value.length
  return allProducts.value.filter((product: Product) => product.categoryId === categoryId).length
}

// 获取徽章样式类
const getBadgeClass = (badge?: string) => {
  if (!badge) return 'badge-default'
  const badgeMap: { [key: string]: string } = {
    '热销': 'badge-hot',
    '新品': 'badge-new',
    '限量': 'badge-limited',
    '推荐': 'badge-recommend',
    '礼品': 'badge-gift',
    '珍藏': 'badge-premium',
    '传统': 'badge-traditional',
    '手工': 'badge-handmade',
    '经典': 'badge-classic',
    '实用': 'badge-practical',
    '复古': 'badge-vintage',
    '新鲜': 'badge-fresh'
  }
  return badgeMap[badge] || 'badge-default'
}

// 方法
const scrollToProducts = () => {
  const productsSection = document.querySelector('.products-section')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToCategories = () => {
  const categorySection = document.querySelector('.category-section')
  if (categorySection) {
    categorySection.scrollIntoView({ behavior: 'smooth' })
  }
}

const showProductDetail = (product: Product) => {
  selectedProduct.value = product
  showDetail.value = true
}

const handleAddToCartClick = (event: Event, product: Product) => {
  event.stopPropagation()
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    cartStore.addToCart(product, 1)
    showSuccessMessage(`${product.name} 已添加到购物车`)
  } catch (error: any) {
    alert(error.message)
  }
}

// 处理快速查看
const handleQuickView = (product: Product) => {
  showProductDetail(product)
}

// 处理收藏
const handleWishlist = (product: Product) => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  showSuccessMessage(`${product.name} 已添加到收藏夹`)
}

// 处理立即购买
const handleBuyNowClick = (event?: Event, product?: any) => {
  if (event) event.stopPropagation()
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  const targetProduct = product || selectedProduct.value
  if (!targetProduct) {
    alert('请选择要购买的产品')
    return
  }

  try {
    cartStore.addToCart(targetProduct, 1)
    showSuccessMessage(`${targetProduct.name} 已添加到购物车，准备结算`)
  } catch (error: any) {
    alert(error.message)
  }
}

// 显示成功消息
const showSuccessMessage = (message: string) => {
  // 这里可以集成更好的通知组件
  alert(message)
}

// 关闭产品详情
const closeDetail = () => {
  showDetail.value = false
  selectedProduct.value = null
}

// 图片切换功能
const switchDetailImage = (event: Event) => {
  const target = event.target as HTMLImageElement
  const container = target.closest('.image-gallery')
  if (container) {
    const images = container.querySelectorAll('img')
    images.forEach(img => img.classList.remove('active'))
    target.classList.add('active')
  }
}

// 页面滚动动画
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })

  // 观察所有需要动画的元素
  const animateElements = document.querySelectorAll('.category-card, .product-card, .featured-card')
  animateElements.forEach(el => observer.observe(el))
}

// 英雄区域轮播
const startHeroCarousel = () => {
  const slides = document.querySelectorAll('.hero-slide')
  if (slides.length <= 1) return

  let currentSlide = 0
  setInterval(() => {
    slides[currentSlide].classList.remove('active')
    currentSlide = (currentSlide + 1) % slides.length
    slides[currentSlide].classList.add('active')
  }, 5000)
}

// 产品卡片悬停效果
const addProductHoverEffects = () => {
  const productCards = document.querySelectorAll('.product-card')
  productCards.forEach(card => {
    const cardElement = card as HTMLElement
    card.addEventListener('mouseenter', () => {
      cardElement.style.transform = 'translateY(-8px) scale(1.02)'
    })
    card.addEventListener('mouseleave', () => {
      cardElement.style.transform = 'translateY(0) scale(1)'
    })
  })
}

// 平滑滚动到元素
const smoothScrollTo = (element: Element) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

// 添加页面加载动画
const addPageLoadAnimation = () => {
  const elements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animate-in')
    }, index * 100)
  })
}

onMounted(() => {
  // 页面初始化
  console.log('周边产品页面加载完成')

  // 启动各种动画效果
  setTimeout(() => {
    observeElements()
    startHeroCarousel()
    addProductHoverEffects()
    addPageLoadAnimation()
  }, 100)

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

// 清理事件监听
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 现代化产品页面样式 */
.page-container {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #e8f5e8 0%, #e1f5fe 50%, #f0f8ff 100%);
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 全局动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out;
}

.scale-in {
  animation: scaleIn 0.4s ease-out;
}

/* 滚动触发动画 */
.category-card,
.product-card,
.featured-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.category-card.animate-in,
.product-card.animate-in,
.featured-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 特殊动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.glowing {
  animation: glow 2s ease-in-out infinite;
}

/* 加载动画 */
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



/* 现代化英雄区域 */
.products-hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 2;
}

/* 英雄内容区域 */
.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideInLeft 0.8s ease-out 0.2s both;
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  color: white;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.title-main {
  display: block;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.title-sub {
  display: block;
  font-size: 0.6em;
  color: #ffd700;
  margin-top: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.8s ease-out 0.6s both;
}

.subtitle-highlight {
  color: #ffd700;
  font-weight: 600;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.btn {
  position: relative;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(167, 202, 135, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.btn-outline-white {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 255, 255, 0.1);
}

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

/* 现代化分类区域 */
.category-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fffe 0%, #e8f5e8 50%, #f0f8ff 100%);
  position: relative;
  overflow: hidden;
}

.category-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(167, 202, 135, 0.1), transparent);
  transition: left 0.5s;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover,
.category-card.active {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(167, 202, 135, 0.15);
  border-color: #a7ca87;
}

.category-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 8px 25px rgba(167, 202, 135, 0.3);
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.category-content {
  flex: 1;
}

.category-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.category-card:hover .category-name {
  color: #0cd398;
}

.category-desc {
  color: #6b7280;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.category-count {
  color: #0cd398;
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(167, 202, 135, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
}

/* 特色推荐区域 */
.featured-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5016 50%, #4a7c59 100%);
  position: relative;
  overflow: hidden;
}

.featured-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E") repeat;
  z-index: 1;
}

.featured-section .section-header {
  position: relative;
  z-index: 2;
  color: white;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.featured-section .section-title {
  color: white;
  margin-bottom: 0;
}

.title-highlight {
  display: block;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.featured-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  position: relative;
  z-index: 2;
}

.featured-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
}

.featured-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.featured-card .product-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.featured-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-card:hover .product-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-card:hover .image-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-view-btn:hover {
  background: white;
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  z-index: 3;
}

.product-rating {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 3;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.stars .svg-icon {
  color: #d1d5db;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  filter: grayscale(100%);
}

.stars .svg-icon.active {
  color: #FFD700;
  filter: grayscale(0%);
}

.rating-text {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 产品区域 */
.products-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fffe 0%, #e8f5e8 50%, #f0f8ff 100%);
  position: relative;
}

/* 产品筛选区域 */
.products-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #6b7280;
}

.filter-tab:hover,
.filter-tab.active {
  background: #0cd398;
  border-color: #0cd398;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(12, 211, 152, 0.3);
}

.filter-tab .count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filter-sort {
  position: relative;
}

.sort-select {
  padding: 0.8rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #0cd398;
  box-shadow: 0 0 0 3px rgba(12, 211, 152, 0.1);
}

/* 现代化产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.product-card.modern-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}

.product-card.modern-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
  border-color: #0cd398;
}

.product-image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.15);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #1f2937;
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
  color: #0cd398;
}

.action-btn .tooltip {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn:hover .tooltip {
  opacity: 1;
}

.product-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 3;
}

.badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-hot { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); }
.badge-new { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.badge-limited { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.badge-recommend { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.badge-gift { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
.badge-premium { background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); }

.product-rating-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 3;
}

.rating-score {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-content {
  padding: 2rem;
}

.product-category {
  color: #0cd398;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.8rem;
  line-height: 1.3;
}

.product-description {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.product-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(167, 202, 135, 0.1);
  color: #0cd398;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  flex: 1;
}

.price-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.current-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0cd398;
}

.original-price {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.discount-percent {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-buy-now {
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-buy-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

/* 加载更多按钮 */
.load-more-section {
  text-align: center;
  margin-top: 4rem;
  padding: 2rem 0;
}

.load-more-btn {
  background: white;
  color: #d4af37;
  border: 2px solid #d4af37;
  padding: 1rem 3rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.load-more-btn:hover:not(:disabled) {
  background: #d4af37;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.3);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid #d4af37;
  color: #d4af37;
}

.btn-outline:hover {
  background: #d4af37;
  color: white;
}

/* 滚动到顶部按钮 */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.scroll-top-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

/* 产品详情弹窗 */
.product-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeInUp 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: scaleIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6b7280;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.detail-image {
  position: relative;
}

.detail-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.image-gallery img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.image-gallery img.active,
.image-gallery img:hover {
  opacity: 1;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-desc {
  color: #6b7280;
  line-height: 1.6;
}

.detail-specs h4 {
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.detail-specs ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-specs li {
  color: #6b7280;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-price {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-price .current-price {
  font-size: 2rem;
  font-weight: 800;
  color: #d4af37;
}

.detail-price .original-price {
  font-size: 1.2rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.detail-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: white;
  color: #d4af37;
  border: 2px solid #d4af37;
}

.btn-secondary:hover {
  background: #d4af37;
  color: white;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-content {
    padding: 0 1.5rem;
  }

  .featured-showcase {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .products-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-tabs {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .category-card {
    padding: 2rem;
  }

  .featured-showcase {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .filter-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-body {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .detail-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .category-card {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-content {
    padding: 1.5rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
}
</style>

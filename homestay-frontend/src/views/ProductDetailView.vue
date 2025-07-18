<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <i class="fas fa-seedling"></i>
          普洱蘑菇庄园
        </div>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/tea-culture" class="nav-link">茶文化</router-link>
          <router-link to="/products" class="nav-link">民宿产品</router-link>
          <router-link to="/ai-rooms" class="nav-link">AI选房</router-link>
          <router-link to="/orders" class="nav-link">订单</router-link>
          <router-link to="/profile" class="nav-link" v-if="auth.isAuthenticated">个人信息</router-link>
        </div>
        <div class="nav-buttons">
          <template v-if="auth.isAuthenticated">
            <div class="user-info">
              <button @click="router.push('/profile')" class="btn btn-outline">个人信息</button>
              <button @click="auth.logout" class="btn btn-outline">退出</button>
            </div>
          </template>
          <template v-else>
            <button @click="router.push('/login')" class="btn btn-outline">登录</button>
            <button @click="router.push('/register')" class="btn btn-primary">注册</button>
          </template>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">首页</router-link>
          <span class="breadcrumb-separator">/</span>
          <router-link to="/products" class="breadcrumb-link">民宿产品</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ product?.name }}</span>
        </div>

        <div v-if="product" class="product-detail">
          <!-- 产品图片和基本信息 -->
          <div class="product-main">
            <div class="product-gallery">
              <div class="main-image">
                <img :src="currentImage" :alt="product.name">
              </div>
              <div class="thumbnail-list" v-if="product.images.length > 1">
                <div 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  class="thumbnail"
                  :class="{ active: currentImage === image }"
                  @click="currentImage = image"
                >
                  <img :src="image" :alt="`${product.name} ${index + 1}`">
                </div>
              </div>
            </div>

            <div class="product-info">
              <div class="product-header">
                <h1 class="product-title">{{ product.name }}</h1>
                <div class="product-category">
                  <span class="category-tag">{{ getCategoryLabel(product.category) }}</span>
                  <span class="origin-tag">{{ product.origin }}</span>
                </div>
              </div>

              <div class="product-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" :class="['star', { filled: i <= Math.floor(product.rating) }]">⭐</span>
                </div>
                <span class="rating-text">{{ product.rating }} ({{ product.reviews }}条评价)</span>
              </div>

              <div class="product-price">
                <span class="current-price">￥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">￥{{ product.originalPrice }}</span>
                <span v-if="product.originalPrice" class="discount">
                  省￥{{ product.originalPrice - product.price }}
                </span>
              </div>

              <div class="product-description">
                <p>{{ product.description }}</p>
              </div>

              <div class="product-features">
                <h3>产品特色</h3>
                <ul>
                  <li v-for="feature in product.features" :key="feature">
                    <i class="fas fa-check"></i>
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="product-specifications" v-if="product.specifications">
                <h3>产品规格</h3>
                <div class="spec-grid">
                  <div 
                    v-for="(value, key) in product.specifications" 
                    :key="key"
                    class="spec-item"
                  >
                    <span class="spec-label">{{ key }}:</span>
                    <span class="spec-value">{{ value }}</span>
                  </div>
                </div>
              </div>

              <div class="purchase-section">
                <div class="quantity-selector">
                  <label>数量:</label>
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                    <span class="quantity">{{ quantity }}</span>
                    <button @click="increaseQuantity">+</button>
                  </div>
                </div>

                <div class="action-buttons">
                  <button @click="addToCart" class="btn btn-outline btn-large">
                    <i class="fas fa-shopping-cart"></i>
                    加入购物车
                  </button>
                  <button @click="buyNow" class="btn btn-primary btn-large">
                    <i class="fas fa-credit-card"></i>
                    立即购买
                  </button>
                </div>

                <div class="stock-status">
                  <span v-if="product.inStock" class="in-stock">
                    <i class="fas fa-check-circle"></i>
                    现货供应
                  </span>
                  <span v-else class="out-of-stock">
                    <i class="fas fa-times-circle"></i>
                    暂时缺货
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 文化背景和推荐用途 -->
          <div class="product-details">
            <div class="detail-section">
              <h2>文化背景</h2>
              <div class="cultural-background">
                <p>{{ product.culturalBackground }}</p>
              </div>
            </div>

            <div class="detail-section">
              <h2>推荐用途</h2>
              <div class="recommended-uses">
                <div 
                  v-for="use in product.recommendedUse" 
                  :key="use"
                  class="use-tag"
                >
                  {{ use }}
                </div>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div class="related-products">
            <h2>相关推荐</h2>
            <div class="products-grid">
              <div 
                v-for="relatedProduct in relatedProducts" 
                :key="relatedProduct.id"
                class="product-card"
                @click="viewProduct(relatedProduct.id)"
              >
                <div class="product-image">
                  <img :src="relatedProduct.images[0]" :alt="relatedProduct.name">
                </div>
                <div class="product-info">
                  <h4>{{ relatedProduct.name }}</h4>
                  <div class="product-price">
                    <span class="current-price">￥{{ relatedProduct.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>加载中...</p>
        </div>
      </div>
    </main>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { productAI, type Product } from '../services/ProductAIService'


const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const product = ref<Product>()
const currentImage = ref('')
const quantity = ref(1)
const relatedProducts = ref<Product[]>([])

// 计算属性
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'tea': '茶叶',
    'food': '美食',
    'craft': '工艺品',
    'souvenir': '纪念品',
    'experience': '体验'
  }
  return labels[category] || category
}

// 方法
const loadProduct = () => {
  const productId = route.params.id as string
  const foundProduct = productAI.getProductById(productId)
  
  if (foundProduct) {
    product.value = foundProduct
    currentImage.value = foundProduct.images[0]
    loadRelatedProducts()
  } else {
    router.push('/products')
  }
}

const loadRelatedProducts = () => {
  if (product.value) {
    const allProducts = productAI.getProductCatalog()
    relatedProducts.value = allProducts
      .filter(p => p.id !== product.value!.id && p.category === product.value!.category)
      .slice(0, 4)
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // 这里可以添加到购物车的逻辑
  console.log('添加到购物车:', product.value?.name, quantity.value)
  // 可以显示成功提示
}

const buyNow = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // 直接跳转到订单页面
  router.push({
    path: '/orders',
    query: {
      action: 'create',
      productId: product.value?.id,
      quantity: quantity.value.toString()
    }
  })
}

const viewProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}

// 生命周期
onMounted(() => {
  loadProduct()
})

// 监听路由变化
router.afterEach(() => {
  if (route.name === 'ProductDetail') {
    loadProduct()
  }
})
</script>

<style scoped>
/* 基础样式 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 导航栏样式 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.nav-buttons {
  display: flex;
  gap: 12px;
}

.user-info {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #10b981;
  border: 2px solid #10b981;
}

.btn-outline:hover {
  background: #10b981;
  color: white;
}

.btn-large {
  padding: 14px 28px;
  font-size: 1.1rem;
}

/* 主要内容 */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #10b981;
}

.breadcrumb-separator {
  color: #9ca3af;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 500;
}

/* 产品详情 */
.product-detail {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

/* 产品图片 */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.thumbnail.active {
  border-color: #10b981;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 产品信息 */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.product-category {
  display: flex;
  gap: 8px;
}

.category-tag,
.origin-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.category-tag {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.origin-tag {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.2rem;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.rating-text {
  color: #6b7280;
  font-size: 0.9rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
}

.original-price {
  font-size: 1.2rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount {
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.product-description p {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.1rem;
}

.product-features h3,
.product-specifications h3 {
  color: #1f2937;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #4b5563;
}

.product-features i {
  color: #10b981;
  width: 16px;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.spec-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.spec-value {
  color: #1f2937;
  font-weight: 600;
}

/* 购买区域 */
.purchase-section {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.quantity-selector label {
  font-weight: 500;
  color: #1f2937;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-controls button {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover:not(:disabled) {
  background: #f3f4f6;
  color: #10b981;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  padding: 0 16px;
  font-weight: 500;
  color: #1f2937;
  min-width: 40px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.action-buttons .btn {
  flex: 1;
}

.stock-status {
  text-align: center;
}

.in-stock,
.out-of-stock {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.in-stock {
  color: #10b981;
}

.out-of-stock {
  color: #ef4444;
}

/* 详情区域 */
.product-details {
  padding: 40px;
  border-top: 1px solid #e5e7eb;
}

.detail-section {
  margin-bottom: 40px;
}

.detail-section h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #10b981;
  display: inline-block;
}

.cultural-background {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #d4af37;
}

.cultural-background p {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.1rem;
  margin: 0;
}

.recommended-uses {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.use-tag {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* 相关推荐 */
.related-products {
  padding: 40px;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.related-products h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 24px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-card .product-image {
  height: 180px;
  overflow: hidden;
}

.product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-card .product-info {
  padding: 16px;
}

.product-card h4 {
  color: #1f2937;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.product-card .product-price {
  margin: 0;
}

.product-card .current-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #10b981;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #10b981;
}

.loading p {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .product-main {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .main-image {
    height: 300px;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .product-details,
  .related-products {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .breadcrumb {
    font-size: 0.8rem;
  }

  .product-main {
    padding: 16px;
  }

  .product-info {
    gap: 16px;
  }

  .spec-grid {
    grid-template-columns: 1fr;
  }

  .quantity-controls {
    width: 120px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>

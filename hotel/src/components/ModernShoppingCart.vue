<template>
  <div class="modern-shopping-cart">
    <!-- 购物车触发按钮 -->
    <button @click="toggleCart" class="cart-trigger" :class="{ 'has-items': cartStore.totalItems > 0 }">
      <div class="cart-icon-wrapper">
        <SvgIcon name="shopping-cart" size="24" />
        <transition name="bounce">
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </transition>
      </div>
    </button>

    <!-- 购物车侧边栏 -->
    <transition name="slide-fade">
      <div v-if="showCart" class="cart-overlay" @click="closeCart">
        <div class="cart-sidebar" @click.stop>
          <!-- 购物车头部 -->
          <div class="cart-header">
            <div class="header-content">
              <h3>
                <SvgIcon name="shopping-cart" size="24" color="#d4af37" />
                购物车
              </h3>
              <div class="cart-summary">
                <span class="item-count">{{ cartStore.totalItems }}件商品</span>
                <span class="total-amount">¥{{ cartStore.totalAmount }}</span>
              </div>
            </div>
            <button @click="closeCart" class="close-btn">
              <SvgIcon name="times" size="20" />
            </button>
          </div>

          <!-- 购物车内容 -->
          <div class="cart-content">
            <!-- 空购物车状态 -->
            <div v-if="cartStore.items.length === 0" class="empty-cart">
              <div class="empty-illustration">
                <SvgIcon name="shopping-cart" size="64" color="#e5e7eb" />
              </div>
              <h4>购物车是空的</h4>
              <p>快去挑选您喜欢的商品吧</p>
              <button @click="closeCart" class="browse-btn">
                <SvgIcon name="search" size="16" />
                浏览商品
              </button>
            </div>

            <!-- 购物车商品列表 -->
            <div v-else class="cart-items">
              <transition-group name="list" tag="div">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="cart-item"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" />
                    <div class="item-category">{{ item.category }}</div>
                  </div>
                  
                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-description">{{ item.description }}</p>
                    
                    <div class="item-specs" v-if="item.specs && item.specs.length">
                      <span v-for="spec in item.specs" :key="spec" class="spec-tag">
                        {{ spec }}
                      </span>
                    </div>
                    
                    <div class="item-pricing">
                      <div class="price-info">
                        <span class="current-price">¥{{ item.price }}</span>
                        <span v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
                          ¥{{ item.originalPrice }}
                        </span>
                      </div>
                      <div class="savings" v-if="item.originalPrice && item.originalPrice > item.price">
                        省 ¥{{ (item.originalPrice - item.price).toFixed(2) }}
                      </div>
                    </div>
                  </div>

                  <div class="item-controls">
                    <div class="quantity-control">
                      <button 
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="qty-btn decrease"
                      >
                        <SvgIcon name="minus" size="14" />
                      </button>
                      <span class="quantity">{{ item.quantity }}</span>
                      <button 
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="qty-btn increase"
                      >
                        <SvgIcon name="plus" size="14" />
                      </button>
                    </div>
                    
                    <div class="item-total">
                      ¥{{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                    
                    <button @click="removeItem(item.id)" class="remove-btn">
                      <SvgIcon name="trash" size="16" />
                    </button>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- 购物车底部 -->
          <div v-if="cartStore.items.length > 0" class="cart-footer">
            <!-- 优惠信息 -->
            <div v-if="cartStore.savedAmount > 0" class="savings-info">
              <SvgIcon name="tag" size="16" color="#10b981" />
              <span>您已节省 ¥{{ cartStore.savedAmount.toFixed(2) }}</span>
            </div>

            <!-- 价格汇总 -->
            <div class="price-summary">
              <div class="summary-row">
                <span>商品总价</span>
                <span>¥{{ cartStore.originalTotalAmount.toFixed(2) }}</span>
              </div>
              <div v-if="cartStore.savedAmount > 0" class="summary-row discount">
                <span>优惠金额</span>
                <span>-¥{{ cartStore.savedAmount.toFixed(2) }}</span>
              </div>
              <div class="summary-total">
                <span>合计</span>
                <span class="total-price">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="cart-actions">
              <button @click="clearCart" class="clear-btn">
                <SvgIcon name="trash" size="16" />
                清空购物车
              </button>
              <button @click="proceedToCheckout" class="checkout-btn">
                <SvgIcon name="credit-card" size="16" />
                去结算 ({{ cartStore.totalItems }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 结算弹窗 -->
    <ModernCheckout 
      v-if="showCheckout" 
      @close="showCheckout = false"
      @success="handleCheckoutSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import SvgIcon from './icons/SvgIcon.vue'
import ModernCheckout from './ModernCheckout.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showCart = ref(false)
const showCheckout = ref(false)

// 切换购物车显示 - 移除拦截，直接显示
const toggleCart = () => {
  showCart.value = !showCart.value
}

// 关闭购物车
const closeCart = () => {
  showCart.value = false
}

// 更新商品数量
const updateQuantity = (productId: number, quantity: number) => {
  if (quantity <= 0) return
  cartStore.updateQuantity(productId, quantity)
}

// 移除商品
const removeItem = (productId: number) => {
  cartStore.removeFromCart(productId)
}

// 清空购物车
const clearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    cartStore.clearCart()
  }
}

// 前往结算
const proceedToCheckout = () => {
  showCart.value = false
  showCheckout.value = true
}

// 结算成功处理
const handleCheckoutSuccess = () => {
  showCheckout.value = false
  router.push('/orders')
}
</script>

<style scoped>
.modern-shopping-cart {
  position: relative;
}

/* 购物车触发按钮 */
.cart-trigger {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.cart-trigger.has-items {
  animation: pulse 2s infinite;
}

.cart-icon-wrapper {
  position: relative;
  color: white;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid white;
}

/* 购物车覆盖层 */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  justify-content: flex-end;
}

/* 购物车侧边栏 */
.cart-sidebar {
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
}

/* 购物车头部 */
.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.header-content h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.cart-summary {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.item-count {
  color: #6b7280;
}

.total-amount {
  color: #d4af37;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 购物车内容 */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* 空购物车状态 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.empty-illustration {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-cart h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.125rem;
}

.empty-cart p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* 动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-8px,0); }
  70% { transform: translate3d(0,-4px,0); }
  90% { transform: translate3d(0,-2px,0); }
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce 0.6s;
}

.bounce-leave-active {
  animation: bounce 0.6s reverse;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* 购物车商品项 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.cart-item:hover {
  border-color: #d4af37;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
}

.item-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-category {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(212, 175, 55, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.item-description {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.spec-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.item-pricing {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: #d4af37;
}

.original-price {
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.savings {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.qty-btn {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.qty-btn:hover:not(:disabled) {
  background: #e5e7eb;
  color: #374151;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 32px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.item-total {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  color: #ef4444;
}

.remove-btn:hover {
  background: #fef2f2;
}

/* 购物车底部 */
.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.savings-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #166534;
}

.price-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-row.discount {
  color: #10b981;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-weight: 700;
  color: #1f2937;
}

.total-price {
  font-size: 1.125rem;
  color: #d4af37;
}

.cart-actions {
  display: flex;
  gap: 0.75rem;
}

.clear-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.checkout-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cart-trigger {
    bottom: 1rem;
    right: 1rem;
    width: 56px;
    height: 56px;
  }

  .cart-sidebar {
    width: 100vw;
  }

  .cart-header {
    padding: 1rem;
  }

  .cart-content {
    padding: 0.75rem;
  }

  .cart-item {
    padding: 0.75rem;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .cart-actions {
    flex-direction: column;
  }
}
</style>

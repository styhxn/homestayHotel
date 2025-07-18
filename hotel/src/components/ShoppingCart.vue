<template>
  <div class="shopping-cart">
    <!-- 购物车按钮 -->
    <button @click="toggleCart" class="cart-button" :class="{ active: showCart }">
      <i class="fas fa-shopping-cart"></i>
      <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
    </button>

    <!-- 购物车侧边栏 -->
    <div v-if="showCart" class="cart-overlay" @click="toggleCart">
      <div class="cart-sidebar" @click.stop>
        <div class="cart-header">
          <h3>购物车</h3>
          <button @click="toggleCart" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="cart-content">
          <!-- 空购物车 -->
          <div v-if="cartStore.items.length === 0" class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>购物车是空的</p>
            <button @click="toggleCart" class="btn-primary">继续购物</button>
          </div>

          <!-- 购物车商品列表 -->
          <div v-else class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p class="item-desc">{{ item.description }}</p>
                <div class="item-price">
                  <span class="current-price">¥{{ item.price }}</span>
                  <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
                </div>
                <div class="quantity-controls">
                  <button @click="updateQuantity(item.id, item.quantity - 1)" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="item-actions">
                <button @click="removeItem(item.id)" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 购物车底部 -->
        <div v-if="cartStore.items.length > 0" class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>商品总数：</span>
              <span>{{ cartStore.totalItems }}件</span>
            </div>
            <div v-if="cartStore.savedAmount > 0" class="summary-row discount">
              <span>优惠金额：</span>
              <span>-¥{{ cartStore.savedAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>总计：</span>
              <span>¥{{ cartStore.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button @click="clearCart" class="btn-secondary">清空购物车</button>
            <button @click="showCheckout = true" class="btn-primary">去结算</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算弹窗 -->
    <div v-if="showCheckout" class="checkout-modal" @click="showCheckout = false">
      <div class="checkout-content" @click.stop>
        <div class="checkout-header">
          <h3>确认订单</h3>
          <button @click="showCheckout = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="checkout-body">
          <!-- 商品列表 -->
          <div class="order-items">
            <h4>商品清单</h4>
            <div v-for="item in cartStore.items" :key="item.id" class="order-item">
              <img :src="item.image" :alt="item.name" />
              <div class="item-details">
                <div class="item-details-row">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="item-details-row">
                  <span class="item-quantity">数量: {{ item.quantity }}</span>
                  <span class="item-unit-price">单价: ¥{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 配送信息 -->
          <div class="shipping-info">
            <h4>配送信息</h4>
            <div class="form-group">
              <label>收货地址：</label>
              <textarea 
                v-model="orderForm.shippingAddress" 
                placeholder="请输入详细的收货地址"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>联系电话：</label>
              <input 
                v-model="orderForm.contactPhone" 
                type="tel" 
                placeholder="请输入联系电话"
                required
              />
            </div>
            <div class="form-group">
              <label>备注信息：</label>
              <textarea 
                v-model="orderForm.remarks" 
                placeholder="如有特殊要求请在此说明（选填）"
              ></textarea>
            </div>
          </div>

          <!-- 订单总计 -->
          <div class="order-summary">
            <div class="summary-row">
              <span>商品总数：</span>
              <span>{{ cartStore.totalItems }}件</span>
            </div>
            <div v-if="cartStore.savedAmount > 0" class="summary-row discount">
              <span>优惠金额：</span>
              <span>-¥{{ cartStore.savedAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>配送费：</span>
              <span>免费</span>
            </div>
            <div class="summary-row total">
              <span>应付总额：</span>
              <span>¥{{ cartStore.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="checkout-footer">
          <button @click="showCheckout = false" class="btn-secondary">返回购物车</button>
          <button @click="submitOrder" class="btn-primary" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            {{ isSubmitting ? '提交中...' : '确认下单' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ShoppingCart',
  setup() {

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const showCart = ref(false)
const showCheckout = ref(false)
const isSubmitting = ref(false)

const orderForm = ref({
  shippingAddress: '',
  contactPhone: '',
  remarks: ''
})

// 切换购物车显示
const toggleCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  showCart.value = !showCart.value
}

// 更新商品数量
const updateQuantity = (productId: number, quantity: number) => {
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

// 提交订单
const submitOrder = async () => {
  if (!orderForm.value.shippingAddress.trim()) {
    alert('请填写收货地址')
    return
  }

  if (!orderForm.value.contactPhone.trim()) {
    alert('请填写联系电话')
    return
  }

  isSubmitting.value = true

  try {
    const order = await cartStore.createOrder({
      shippingAddress: orderForm.value.shippingAddress,
      contactPhone: orderForm.value.contactPhone,
      remarks: orderForm.value.remarks
    })

    alert(`订单提交成功！\n订单号：${order.id}`)
    
    // 重置表单
    orderForm.value = {
      shippingAddress: '',
      contactPhone: '',
      remarks: ''
    }
    
    // 关闭弹窗
    showCheckout.value = false
    showCart.value = false
    
    // 跳转到订单页面
    router.push('/orders')
    
  } catch (error: any) {
    alert('订单提交失败：' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 初始化用户数据
  if (authStore.isAuthenticated) {
    cartStore.initializeUserData()
  }
})

    return {
      cartStore,
      authStore,
      showCart,
      showCheckout,
      isSubmitting,
      orderForm,
      toggleCart,
      updateQuantity,
      removeItem,
      clearCart,
      submitOrder
    }
  }
})
</script>

<style scoped>
.shopping-cart {
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  z-index: 999;
}

.cart-button {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.cart-button:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.cart-button.active {
  background: #0056b3;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.cart-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
  color: #999;
}

.empty-cart i {
  font-size: 48px;
  margin-bottom: 20px;
}

.cart-items {
  padding: 20px;
}

.cart-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.item-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.item-price {
  margin-bottom: 10px;
}

.current-price {
  color: #e74c3c;
  font-weight: 600;
}

.original-price {
  margin-left: 8px;
  text-decoration: line-through;
  color: #999;
  font-size: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.qty-btn:hover {
  background: #f8f9fa;
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.item-actions {
  display: flex;
  align-items: flex-start;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
}

.remove-btn:hover {
  color: #c82333;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cart-summary {
  margin-bottom: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-row.discount {
  color: #28a745;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* 结算弹窗样式 */
.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.checkout-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
  background: white;
}

.checkout-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.order-items, .shipping-info, .order-summary {
  margin-bottom: 30px;
}

.order-items h4, .shipping-info h4 {
  margin-bottom: 15px;
  color: #333;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: #666;
}

.item-price {
  color: #e74c3c;
  font-weight: 600;
}

.item-unit-price {
  color: #666;
  font-size: 12px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkout-footer {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: white;
  border-radius: 0 0 12px 12px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .cart-sidebar {
    width: 100%;
  }

  .shopping-cart {
    left: 15px;
  }

  .cart-button {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  .checkout-content {
    width: 95%;
    max-height: 95vh;
    margin: 10px;
  }

  .checkout-header {
    padding: 15px;
  }

  .checkout-body {
    padding: 15px;
  }

  .checkout-footer {
    padding: 15px;
    flex-direction: column;
  }

  .checkout-footer .btn {
    width: 100%;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .order-item img {
    width: 40px;
    height: 40px;
  }
}
</style>

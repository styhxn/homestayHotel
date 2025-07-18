<template>
  <div class="checkout-overlay" @click="$emit('close')">
    <div class="checkout-modal" @click.stop>
      <!-- 结算头部 -->
      <div class="checkout-header">
        <h3>
          <SvgIcon name="credit-card" size="24" color="#d4af37" />
          确认订单
        </h3>
        <button @click="$emit('close')" class="close-btn">
          <SvgIcon name="times" size="20" />
        </button>
      </div>

      <!-- 结算内容 -->
      <div class="checkout-content">
        <!-- 订单商品 -->
        <div class="order-items">
          <h4>订单商品 ({{ cartStore.totalItems }}件)</h4>
          <div class="items-list">
            <div v-for="item in cartStore.items" :key="item.id" class="checkout-item">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-info">
                <h5>{{ item.name }}</h5>
                <p>{{ item.description }}</p>
                <div class="item-meta">
                  <span class="quantity">数量: {{ item.quantity }}</span>
                  <span class="price">¥{{ item.price }} × {{ item.quantity }}</span>
                </div>
              </div>
              <div class="item-total">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 配送信息 -->
        <div class="delivery-info">
          <h4>
            <SvgIcon name="location" size="18" />
            配送信息
          </h4>
          <div class="form-group">
            <label>收货地址 *</label>
            <textarea
              v-model="orderForm.shippingAddress"
              placeholder="请输入详细的收货地址"
              rows="3"
              class="form-textarea"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>联系电话 *</label>
            <input
              v-model="orderForm.contactPhone"
              type="tel"
              placeholder="请输入联系电话"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>备注信息</label>
            <textarea
              v-model="orderForm.remarks"
              placeholder="如有特殊要求请在此说明"
              rows="2"
              class="form-textarea"
            ></textarea>
          </div>
        </div>

        <!-- 价格汇总 -->
        <div class="price-summary">
          <h4>
            <SvgIcon name="money-bill" size="18" />
            价格明细
          </h4>
          <div class="summary-details">
            <div class="summary-row">
              <span>商品总价</span>
              <span>¥{{ cartStore.originalTotalAmount.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.savedAmount > 0" class="summary-row discount">
              <span>优惠金额</span>
              <span>-¥{{ cartStore.savedAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>配送费</span>
              <span class="free">免费</span>
            </div>
            <div class="summary-total">
              <span>应付金额</span>
              <span class="total-amount">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 结算底部 -->
      <div class="checkout-footer">
        <div class="payment-info">
          <div class="total-display">
            <span class="label">合计：</span>
            <span class="amount">¥{{ cartStore.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="payment-note">
            <SvgIcon name="check-circle" size="16" color="#10b981" />
            支持货到付款，安全可靠
          </div>
        </div>
        <div class="checkout-actions">
          <button @click="$emit('close')" class="cancel-btn">
            取消
          </button>
          <button 
            @click="submitOrder" 
            :disabled="!canSubmit || isSubmitting"
            class="submit-btn"
          >
            <SvgIcon v-if="isSubmitting" name="spinner" spin size="16" />
            <SvgIcon v-else name="check" size="16" />
            {{ isSubmitting ? '提交中...' : '确认下单' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import SvgIcon from './icons/SvgIcon.vue'

const emit = defineEmits(['close', 'success'])

const cartStore = useCartStore()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const orderForm = ref({
  shippingAddress: '',
  contactPhone: authStore.user?.phone || '',
  remarks: ''
})

const canSubmit = computed(() => {
  return orderForm.value.shippingAddress.trim() && 
         orderForm.value.contactPhone.trim() &&
         cartStore.items.length > 0
})

const submitOrder = async () => {
  if (!canSubmit.value) {
    alert('请填写完整的配送信息')
    return
  }

  isSubmitting.value = true

  try {
    const order = await cartStore.createOrder({
      shippingAddress: orderForm.value.shippingAddress,
      contactPhone: orderForm.value.contactPhone,
      remarks: orderForm.value.remarks
    })

    // 显示成功消息
    alert(`订单提交成功！\n订单号：${order.id}\n我们将尽快为您安排发货`)
    
    emit('success')
  } catch (error: any) {
    alert('订单提交失败：' + error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  padding: 1rem;
}

.checkout-modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.checkout-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
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

.checkout-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.checkout-content h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

/* 订单商品 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.checkout-item .item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.item-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.checkout-item .item-total {
  font-size: 0.875rem;
  font-weight: 700;
  color: #d4af37;
  align-self: center;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* 价格汇总 */
.summary-details {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
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

.summary-row .free {
  color: #10b981;
  font-weight: 500;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-weight: 700;
  color: #1f2937;
}

.total-amount {
  font-size: 1.125rem;
  color: #d4af37;
}

/* 结算底部 */
.checkout-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.payment-info {
  margin-bottom: 1rem;
}

.total-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.total-display .label {
  font-size: 1rem;
  color: #374151;
}

.total-display .amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
}

.payment-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #10b981;
}

.checkout-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn {
  flex: 1;
  padding: 0.875rem;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.submit-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .checkout-modal {
    margin: 0.5rem;
    max-height: calc(100vh - 1rem);
  }

  .checkout-content {
    padding: 1rem;
    gap: 1.5rem;
  }

  .checkout-footer {
    padding: 1rem;
  }

  .checkout-actions {
    flex-direction: column;
  }

  .checkout-item {
    padding: 0.75rem;
  }

  .item-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>

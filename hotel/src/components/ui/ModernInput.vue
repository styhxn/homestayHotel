<template>
  <div class="input-wrapper" :class="{ 'has-error': error, 'is-disabled': disabled }">
    <!-- 标签 -->
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <!-- 输入框容器 -->
    <div class="input-container" :class="[size, variant]">
      <!-- 前置图标 -->
      <div v-if="prefixIcon" class="input-prefix">
        <i :class="prefixIcon"></i>
      </div>
      
      <!-- 输入框 -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        v-bind="$attrs"
      />
      
      <!-- 后置图标 -->
      <div v-if="suffixIcon || showClearButton" class="input-suffix">
        <button
          v-if="showClearButton && modelValue"
          @click="clearInput"
          class="clear-button"
          type="button"
        >
          <i class="fas fa-times"></i>
        </button>
        <i v-if="suffixIcon" :class="suffixIcon"></i>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="input-loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <!-- 帮助文本或错误信息 -->
    <div v-if="error || helpText" class="input-message">
      <span v-if="error" class="error-text">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </span>
      <span v-else-if="helpText" class="help-text">{{ helpText }}</span>
    </div>
    
    <!-- 字符计数 -->
    <div v-if="showCount && maxlength" class="input-count">
      {{ String(modelValue || '').length }} / {{ maxlength }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  prefixIcon?: string
  suffixIcon?: string
  error?: string
  helpText?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  loading?: boolean
  clearable?: boolean
  showCount?: boolean
  maxlength?: number
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  clearable: false,
  showCount: false,
  autocomplete: 'off'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  clear: []
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

// 生成唯一ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// 输入框类名
const inputClasses = computed(() => [
  'modern-input',
  {
    'has-prefix': props.prefixIcon,
    'has-suffix': props.suffixIcon || showClearButton.value,
    'is-focused': isFocused.value,
    'is-loading': props.loading
  }
])

// 是否显示清除按钮
const showClearButton = computed(() => {
  return props.clearable && !props.disabled && !props.readonly
})

// 处理输入
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// 处理焦点
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

// 处理失焦
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// 清除输入
const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 聚焦方法
const focus = () => {
  inputRef.value?.focus()
}

// 失焦方法
const blur = () => {
  inputRef.value?.blur()
}

// 暴露方法
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-wrapper.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 标签样式 */
.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  cursor: pointer;
}

.required-mark {
  color: var(--color-error, #ef4444);
  margin-left: 2px;
}

/* 输入框容器 */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
  background: var(--color-white);
}

/* 尺寸变体 */
.input-container.sm {
  height: 36px;
  padding: 0 var(--spacing-3);
}

.input-container.md {
  height: 44px;
  padding: 0 var(--spacing-4);
}

.input-container.lg {
  height: 52px;
  padding: 0 var(--spacing-5);
}

/* 样式变体 */
.input-container.default {
  border: 1px solid var(--color-gray-300);
}

.input-container.default:hover {
  border-color: var(--color-gray-400);
}

.input-container.default:focus-within {
  border-color: var(--color-primary, #d4af37);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-container.filled {
  background: var(--color-gray-100);
  border: 1px solid transparent;
}

.input-container.filled:hover {
  background: var(--color-gray-200);
}

.input-container.filled:focus-within {
  background: var(--color-white);
  border-color: var(--color-primary, #d4af37);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-container.outlined {
  border: 2px solid var(--color-gray-300);
  background: transparent;
}

.input-container.outlined:hover {
  border-color: var(--color-gray-400);
}

.input-container.outlined:focus-within {
  border-color: var(--color-primary, #d4af37);
}

/* 错误状态 */
.has-error .input-container {
  border-color: var(--color-error, #ef4444) !important;
}

.has-error .input-container:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* 输入框样式 */
.modern-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
  font-family: inherit;
}

.modern-input::placeholder {
  color: var(--color-gray-400);
}

.modern-input:disabled {
  cursor: not-allowed;
}

/* 前置/后置图标 */
.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

.input-prefix {
  margin-right: var(--spacing-2);
}

.input-suffix {
  margin-left: var(--spacing-2);
  gap: var(--spacing-1);
}

.modern-input.has-prefix {
  padding-left: 0;
}

.modern-input.has-suffix {
  padding-right: 0;
}

/* 清除按钮 */
.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: var(--color-gray-400);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 10px;
}

.clear-button:hover {
  background: var(--color-gray-600);
}

/* 加载状态 */
.input-loading {
  position: absolute;
  right: var(--spacing-3);
  display: flex;
  align-items: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-gray-200);
  border-top: 2px solid var(--color-primary, #d4af37);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 消息文本 */
.input-message {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-tight);
}

.error-text {
  color: var(--color-error, #ef4444);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.help-text {
  color: var(--color-gray-500);
}

/* 字符计数 */
.input-count {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  text-align: right;
}

/* 动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .input-container.lg {
    height: 48px;
  }
  
  .input-container.md {
    height: 40px;
  }
}
</style>

import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8091', // 后端API地址（修复为正确的端口8091）
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      // Sa-Token使用satoken作为header名称
      config.headers['satoken'] = token
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    console.log('响应拦截器 - 原始响应:', response)
    console.log('响应拦截器 - 响应数据:', response.data)

    // 返回响应数据，保持与后端API的一致性
    return response.data
  },
  error => {
    // 对响应错误做点什么
    console.error('响应拦截器 - 错误:', error)

    // 处理Token无效的情况
    if (error.response && error.response.status === 500) {
      const errorMessage = error.response.data?.message || error.message || ''
      if (errorMessage.includes('Token无效') || errorMessage.includes('NotLoginException')) {
        console.log('Token无效，清除本地存储并跳转到登录页')
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('menuList')
        window.location.href = '/login'
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
    }

    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      console.log('401未授权，清除本地存储并跳转到登录页')
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('menuList')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 创建包装器以提供正确的类型
const request = Object.assign(
  // 主函数，支持直接调用
  <T = any>(config: any): Promise<ApiResponse<T>> => {
    return service(config)
  },
  // 添加方法
  {
    get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
      return service.get(url, config)
    },
    post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
      return service.post(url, data, config)
    },
    put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
      return service.put(url, data, config)
    },
    delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
      return service.delete(url, config)
    }
  }
)

export default request
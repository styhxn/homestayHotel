import request from '@/utils/request'

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserInfo = (data: any) => {
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}

// 更新头像
export const updateAvatar = (avatar: string) => {
  return request({
    url: '/user/avatar',
    method: 'post',
    data: { avatar }
  })
}
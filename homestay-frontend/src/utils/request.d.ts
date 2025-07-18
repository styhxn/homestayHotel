declare module '@/utils/request' {
  import { AxiosInstance } from 'axios'
  interface RequestInstance extends AxiosInstance {
    (config: any): Promise<any>
  }
  const request: RequestInstance
  export default request
}
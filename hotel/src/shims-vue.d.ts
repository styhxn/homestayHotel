declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus' {
  export * from 'element-plus'
}

declare module '@element-plus/icons-vue' {
  import { Component } from 'vue'
  const icons: Record<string, Component>
  export default icons
}
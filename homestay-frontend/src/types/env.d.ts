/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_DIGITAL_HUMAN_API_KEY: string
  readonly VUE_APP_OPENAI_API_KEY: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 为了兼容性，也声明 process.env
declare namespace NodeJS {
  interface ProcessEnv {
    VUE_APP_DIGITAL_HUMAN_API_KEY?: string
    VUE_APP_OPENAI_API_KEY?: string
  }
}

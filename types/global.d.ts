/// <reference types="vitest" />

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

declare module 'unplugin-vue-components/vite'
declare module 'unplugin-auto-import/vite'


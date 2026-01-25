/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_TOKEN_STORAGE_KEY: string
  readonly VITE_REFRESH_TOKEN_STORAGE_KEY: string
  readonly VITE_ENABLE_DARK_MODE: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_API_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_COMMIT_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
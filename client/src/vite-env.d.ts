/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_ADMIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
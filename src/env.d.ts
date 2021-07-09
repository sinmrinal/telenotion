declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    TELEGRAM_API_URL: string;
    TELEGRAM_TOKEN: string;
    TELEGRAM_WEBHOOK: string;
    PORT: string;
  }
}
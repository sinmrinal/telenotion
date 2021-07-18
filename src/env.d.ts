
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    SERVER_URL: string;
    TELEGRAM_API_BASE: string;
    TELEGRAM_TOKEN: string;
    TELEGRAM_WEBHOOK: string;
    NOTION_TOKEN: string;
    NOTION_DATABASE: string;
    PORT: string;
  }
}
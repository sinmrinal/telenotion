require('dotenv').config()

export const __PROD__ = process.env.NODE_ENV === "production"
export const SERVER_URL = process.env.SERVER_URL
export const TELEGRAM_API_BASE = process.env.TELEGRAM_API_BASE
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
export const NOTION_TOKEN = process.env.NOTION_TOKEN
export const NOTION_DATABASE = process.env.NOTION_DATABASE
export const PORT = process.env.PORT
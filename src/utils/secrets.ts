require('dotenv').config()

export const __PROD__ = process.env.NODE_ENV === "production"
export const SERVER_URL = process.env.SERVER_URL
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
export const PORT = process.env.PORT
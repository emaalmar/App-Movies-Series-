import { config } from 'dotenv'
config()

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SECRET_KEY: process.env.SECRET_KEY || (() => {
    if (process.env.NODE_ENV === 'development') {
      return 'dev_secret_key'
    }
    throw new Error('SECRET_KEY environment variable is required')
  })()
  ,
  TMDB_API_KEY: process.env.TMDB_API_KEY
}
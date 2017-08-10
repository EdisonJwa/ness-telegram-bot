module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_ID: 10000000,
  ADMIN_NAME: '',
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  BOT_ID: process.env.BOT_ID || 100000000,
  BOT_NAME: process.env.BOT_NAME || '',
  TIMEOUT: 300,
  CACHE_TIMEOUT: 3,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
  USER_AGENT_MOBILE: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  NAVER_API_KEY_ID: process.env.NAVER_API_KEY_ID || '',
  NAVER_API_KEY_SECRET: process.env.NAVER_API_KEY_SECRET || '',
  KAKAO_API_KEY: process.env.KAKAO_API_KEY || '',
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY || '',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  GLOT_API_KEY: process.env.GLOT_API_KEY || ''
}

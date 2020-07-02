const env = {
  NODE_ENV: process.env.NODE_ENV,
  BASE_API_URL: process.env.BASE_API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  tokens: {
    ACCESS_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
  },
  oauth: {
    google: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
      APP_ID: process.env.FACEBOOK_APP_ID,
      SECRET_KEY: process.env.FACEBOOK_SECRET_KEY
    },
  },
  session: {
    COOKIE_KEY: process.env.COOKIE_SESSION_SECRET
  }
};

export default env;
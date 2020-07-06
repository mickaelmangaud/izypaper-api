const env = {
  NODE_ENV: process.env.NODE_ENV,
  BASE_API_URL: process.env.BASE_API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
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
    COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET
  }
};

export default env;
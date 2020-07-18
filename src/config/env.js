const env = {
  NODE_ENV: process.env.NODE_ENV,
  BASE_API_URL: process.env.BASE_API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  session: {
    COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET
  }
};

export default env;
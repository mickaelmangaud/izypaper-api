import { env } from './env';

export const sessionConfig = {
    secret: env.session.COOKIE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: env.NODE_ENV === 'development' ? false : 'none',
      secure: env.NODE_ENV === 'development' ? false : true,
      httpOnly: true,
    },
    proxy: true,
  }
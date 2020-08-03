import { env } from './env';

export const sessionConfig = {
	name: 'izypaper.sid',
	secret: env.session.COOKIE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    cookie: {
		maxAge: 1000 * 60 * 60 * 24,
		httpOnly: true,
		path: '/',
		/*	sameSite :
			Note This is an attribute that has not yet been fully standardized,
			and may change in the future. This also means many clients may ignore
			this attribute until they understand it.
			'none' will set the SameSite attribute to None for an explicit cross-site cookie.
		*/
        sameSite: env.NODE_ENV === 'development' ? false : 'none',
        secure: env.NODE_ENV === 'development' ? false : true,
		httpOnly: true,
    },
	proxy: true,
	rolling: true,
}
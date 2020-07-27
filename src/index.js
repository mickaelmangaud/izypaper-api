import 'dotenv/config';
import './db';
import './config/passport';
import { env } from './config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import { registerRoutes } from './routes';
import { notFoundHandler, errorHandler } from './middleware';
import { db } from './db';
import { logger } from './utils';
import { applyExpressMiddlewareToApollo } from './apollo';
import helmet from 'helmet';

export const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
};

const app = express();

/* Middlewares */
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

/*** Use cookie sessions ***/
const MongoStore = connectMongo(expressSession);

app.use(expressSession({
  secret: env.session.COOKIE_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  store: new MongoStore({
    mongooseConnection: db,
    collection: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'none',
    secure: env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
  },
  proxy: true,
}));

/*** Passport initialize ***/
app.use(passport.initialize());
app.use(passport.session());

/* REQUEST Logging middleware */
app.use((req, res, next) => {
  logger.debug(`[REQUEST]: ${req.method} | ${req.path} | ${JSON.stringify(req.body)}`);
  next();
});

/* Register Express Auth Routes */
registerRoutes(app);

/* Pass express app to ApolloServer */
applyExpressMiddlewareToApollo(app);

/*** 404 - Not found ***/
app.use(notFoundHandler);

/* Custom error handler */
app.use(errorHandler);

console.log('ahahaha')

app.listen({ port: env.PORT }, () => {
  logger.info(`Server ready at ${env.BASE_API_URL}/graphql`);
});

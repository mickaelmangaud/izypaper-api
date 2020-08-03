import 'dotenv/config';
import './config/passport';
import { env, sessionConfig, corsOptions } from './config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import { registerRoutes } from './routes';
import { notFoundHandler, errorHandler, requestLogin } from './middleware';
import { db } from './db';
import { logger } from './utils';
import { applyExpressMiddlewareToApollo } from './apollo';
import helmet from 'helmet';

const app = express();

/* Middlewares */
app.use(helmet());
app.use(helmet.hidePoweredBy());
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
  ...sessionConfig,
  store: new MongoStore({
    mongooseConnection: db,
    collection: 'sessions',
  }),
}));

/*** Passport initialize ***/
app.use(passport.initialize());
app.use(passport.session());

/* REQUEST Logging middleware */
app.use(requestLogin);

/* Register Express Auth Routes */
registerRoutes(app);

/* Pass express app to ApolloServer */
applyExpressMiddlewareToApollo(app);

/*** 404 - Not found ***/
app.use(notFoundHandler);

/* Custom error handler */
app.use(errorHandler);

app.listen({ port: env.PORT }, () => {
  logger.info(`Server ready at ${env.BASE_API_URL}/graphql`);
});

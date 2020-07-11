import 'dotenv/config';
import { env } from './config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { registerRoutes } from './routes';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import { typeDefs, resolvers } from './graphql';
import { notFoundHandler, errorHandler } from './middleware';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import './config/passport';
import './db';
import { db } from './db';
import { logger } from './utils';

const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true
};

const app = express();

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({req}) => ({
    user: req.user,
  }),
});

/* Middlewares */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const MongoStore = connectMongo(expressSession);

/*** Use cookie sessions ***/
app.use(expressSession({
  secret: env.session.COOKIE_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  store: new MongoStore({
    mongooseConnection: db,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'none',
  },
}));

/*** Passport initialize ***/
app.use(passport.initialize());
app.use(passport.session());

/* Logging middleware */
app.use((req, res, next) => {
  console.log('[REQUEST LOGGIN] :', req);
  next();
});

/* Register Express Auth Routes */
registerRoutes(app);

server.applyMiddleware({ 
  app,
  path: '/graphql',
  cors: corsOptions
});

/*** 404 - Not found ***/
app.use(notFoundHandler);

/* Custom error handler */
app.use(errorHandler);

app.listen({ port: env.PORT }, () => {
  logger.info(`Server ready at ${env.BASE_API_URL}${server.graphqlPath}`);
});

import 'dotenv/config';
import { env } from './config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { registerRoutes } from './routes';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { typeDefs, resolvers } from './graphql';
import { notFoundHandler, errorHandler } from './middleware';
import cors from 'cors';
import './config/passport';
import './db';

const CLIENT_URL = env.NODE_ENV === 'development' ? 'http://localhost:8000' : env.CLIENT_URL;
const BASE_API_URL = env.NODE_ENV === 'development' ? 'http://localhost:5000' : env.BASE_API_URL;
const PORT = env.NODE_ENV === 'development' ? env.PORT : process.env.PORT;

const app = express();

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({req}) => ({
    user: req.user,
  }),
});

/*** Use cookie sessions ***/
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // Session is valid for 24 hours
  keys: [env.session.COOKIE_KEY],
  // httpOnly: true, /** true is default **/
  domain: env.BASE_API_URL, 
  // secure: true,
  name: 'izypaper',
  sameSite: 'none',
  path: '/'
}));

/*** Passport initialize ***/
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({ 
  credentials: true,
  origin: CLIENT_URL  /* Autorise l'envoi des cookies sur ce domaine */
}));

/* Register Express Auth Routes */
registerRoutes(app);

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true
};

server.applyMiddleware({ 
  app,
  path: '/graphql',
  cors: corsOptions
});

/*** 404 - Not found ***/
app.use(notFoundHandler);

/* Custom error handler */
app.use(errorHandler);

app.listen({ port: PORT }, () =>
  console.log(`Server ready at ${BASE_API_URL}${server.graphqlPath}`)
);

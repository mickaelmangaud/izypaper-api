import 'dotenv/config';
import { env } from './config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { registerRoutes } from './routes';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import { typeDefs, resolvers } from './graphql';
import { notFoundHandler, errorHandler } from './middleware';
import cors from 'cors';
import './config/passport';
import './db';

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

/*** Use cookie sessions ***/
app.use(expressSession({
  secret: env.session.COOKIE_SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser(env.session.COOKIE_SESSION_SECRET));

/*** Passport initialize ***/
app.use(passport.initialize());
app.use(passport.session());


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

app.listen({ port: env.PORT }, () =>
  console.log(`Server ready at ${env.BASE_API_URL}${server.graphqlPath}`)
);

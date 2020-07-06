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

const CLIENT_URL = env.NODE_ENV === 'development' ? 'http://localhost:8000' : env.CLIENT_URL;
const PORT = env.NODE_ENV === 'development' ? env.PORT : process.env.PORT;

const corsOptions = {
  origin: env.NODE_ENV === 'production' ? 'https://izypaper.netlify.app' : 'http://localhost:8000',
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
  secret: 'supersecret',
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser('supersecret'));

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

app.listen({ port: PORT }, () =>
  console.log(`Server ready at ${env.BASE_API_URL}${server.graphqlPath}`)
);

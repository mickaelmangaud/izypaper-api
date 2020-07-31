import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers, AuthDirective } from './graphql';
import { corsOptions } from './config';

const apolloServer = new ApolloServer({ 
  typeDefs, 
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
  },
  context: ({req}) => ({
    user: req.user,
  }),
});

export const applyExpressMiddlewareToApollo = app => apolloServer.applyMiddleware({ 
  app,
  path: '/graphql',
  cors: corsOptions,
});
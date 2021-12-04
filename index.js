import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import validateAuthentication from './backend/src/middlewares/authentication.middleware.js';
import connect from './backend/src/database.js';
import typeDefs from './backend/src/schema/index.schema.js';
import resolvers from './backend/src/resolvers/index.resolvers.js';

dotenv.config();
connect();

const startApolloServer = async (typeDefs, resolvers) => {

  const PORT = process.env.PORT;
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => await validateAuthentication(req), introspection: true,
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
};

startApolloServer(typeDefs, resolvers);

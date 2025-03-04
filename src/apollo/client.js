
import fetch from 'isomorphic-fetch'
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GATSBY_HASURA_URI,
    // uri: 'http://localhost:8080/v1/graphql',
    headers: {},
    fetch,
    resolvers: {}
  }),
  connectToDevTools: true,
})

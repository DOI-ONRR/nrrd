
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.HASURA_URI,
    headers: {},
    fetch,
    resolvers: {}
  }),
})

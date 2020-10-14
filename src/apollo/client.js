
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    // uri: process.env.HASURA_URI,
    uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
    headers: {},
    fetch,
    resolvers: {}
  }),
})

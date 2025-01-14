
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GATSBY_HASURA_URI,
    // uri: 'http://localhost:8080/v1/graphql',
    connectToDevTools: true,
    headers: {},
    fetch,
    resolvers: {}
  }),
})

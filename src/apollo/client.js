
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
const HASURA_URI = (process.env.HASURA_URI) ? process.env.HASURA_URI : 'https://hasura-onrr.app.cloud.gov/v1/graphql'

export const client = new ApolloClient({

  cache: new InMemoryCache(),
  link: new HttpLink({
    // uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
    // uri: 'https://hasura-sandbox.app.cloud.gov/v1/graphql',
    // uri: 'https://hasura-nrrd-a.app.cloud.gov/v1/graphql',
      // uri: 'https://hasura-nrrd-b.app.cloud.gov/v1/graphql',
      uri: HASURA_URI,
    headers: {},
    fetch,
    resolvers: {}
  }),
})

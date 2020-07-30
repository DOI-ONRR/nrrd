
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({

  cache: new InMemoryCache(),
  link: new HttpLink({
    // uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
   uri: 'https://hasura-sandbox.app.cloud.gov/v1/graphql',
    // uri: 'https://hasura-nrrd-a.app.cloud.gov/v1/graphql',
//  uri: 'https://hasura-nrrd-b.app.cloud.gov/v1/graphql',
    headers: {},
    fetch,
    resolvers: {}
  }),
})

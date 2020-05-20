
import fetch from 'isomorphic-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({

  cache: new InMemoryCache(),
  link: new HttpLink({
<<<<<<< HEAD
=======
    // uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
>>>>>>> dev
    uri: 'https://hasura-sandbox.app.cloud.gov/v1/graphql',
    headers: {},
    fetch,
    resolvers: {}
  }),
})

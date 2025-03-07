import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from 'isomorphic-fetch';

const client =
  new ApolloClient({
    link: new HttpLink({
      uri: process.env.GATSBY_HASURA_URI,
      fetch
    }),
    cache: new InMemoryCache(),
  });

export default client;
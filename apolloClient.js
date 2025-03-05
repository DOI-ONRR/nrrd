import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.GATSBY_HASURA_URI,
  cache: new InMemoryCache(),
});

export { ApolloProvider, client };
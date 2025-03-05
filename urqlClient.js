import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: process.env.GATSBY_HASURA_URI,
  exchanges: [cacheExchange, fetchExchange],
});

export { Provider, client };
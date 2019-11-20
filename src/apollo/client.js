
import fetch from 'isomorphic-fetch';
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';

export const client = new ApolloClient({

    cache: new InMemoryCache(),
    link: new HttpLink({
	uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
	headers: {
	    'x-hasura-admin-secret': "intentionally wrong secret"
	},
	fetch,
	resolvers: {}
    })
});

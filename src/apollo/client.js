
import fetch from 'isomorphic-fetch';
import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';

export const client = new ApolloClient({

    cache: new InMemoryCache(),
    link: new HttpLink({
	uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
	headers: {
	    'x-hasura-admin-secret': "Admin password for hasura-onrr is secret # adn that is 112019"
	},
	fetch,
	resolvers: {}
    })
});


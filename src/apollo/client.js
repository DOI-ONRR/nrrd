import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch';

export const client = new ApolloClient({
    uri: 'http://ec2-18-191-111-214.us-east-2.compute.amazonaws.com/v1/graphql',
    headers: {
			'x-hasura-admin-secret': 'qUbNGe1ogKcmCDw0XxIAiUbhQEjpGm19'
		    },
    fetch,
});

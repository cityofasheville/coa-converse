import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

let SERVER_URL = 'https://coa-converse-api.ashevillenc.gov/graphql';
if (window.location.origin.indexOf('dev-check-in') > -1 || process.env.USE_DEV_API === 'true') {
  SERVER_URL = 'https://dev-coa-converse-api.ashevillenc.gov/graphql';
}
if (process.env.USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:4000/graphql';
}

const client = new ApolloClient({
  link: createHttpLink({
    uri: SERVER_URL,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;

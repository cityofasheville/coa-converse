import { ApolloClient } from 'apollo-client';
import firebase from 'firebase';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { resolvers } from './resolvers';
import { defaultState } from './defaultState';

let SERVER_URL = 'https://coa-converse-api.ashevillenc.gov/graphql';
if (process.env.USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:8080/graphql';
}

const httpLink = createHttpLink({ uri: SERVER_URL });

const middlewareLink = setContext(
  request =>
    new Promise((success, fail) => {
      const signedInUser = firebase.auth().currentUser;
      if (signedInUser) {
        signedInUser.getIdToken()
        .then((idToken) => {
          sessionStorage.setItem('token', idToken);
        });
      }
      setTimeout(() => {
        success({ headers: {
          authorization: sessionStorage.getItem('token') || null,
        } });
      }, 10);
    })
);

const link = middlewareLink.concat(httpLink);

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers,
});

const aClient = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    link,
  ]),
  cache,
});

aClient.onResetStore(stateLink.writeDefaults);

export const client = aClient;

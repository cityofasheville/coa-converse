import { ApolloClient } from 'apollo-client';
import fetch from 'unfetch';
import firebase from 'firebase/app';
import 'firebase/auth';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { resolvers } from './resolvers';
import { defaultState } from './defaultState';

let serverURL = process.env.SERVER_URL;
console.log('server url', serverURL);
if (process.env.USE_LOCAL_API === 'true') {
  serverURL = 'http://localhost:8080/graphql';
}

const httpLink = createHttpLink({ uri: serverURL, fetch });

const authLink = setContext(
  request =>
    new Promise((success, fail) => {
      const signedInUser = firebase.auth().currentUser;
      if (signedInUser) {
        signedInUser.getIdToken()
        .then((idToken) => {
          localStorage.setItem('token', idToken);
          success({ headers: {
            authorization: idToken,
          } });
          fail(Error(request.statusText));
        });
      } else {
        success({ headers: {
          authorization: localStorage.getItem('token') || null,
        } });
        fail(Error(request.statusText));
      }
    })
);

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers,
});

const aClient = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    authLink,
    httpLink,
  ]),
  cache,
});

aClient.onResetStore(stateLink.writeDefaults);

export const client = aClient;

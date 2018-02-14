import ApolloClient, { createNetworkInterface } from 'apollo-client';
import firebase from 'firebase';

let SERVER_URL = 'https://coa-converse-api.ashevillenc.gov/graphql';
if (process.env.USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:8080/graphql';
}

const networkInterface = createNetworkInterface({ uri: SERVER_URL });

/* eslint-disable no-param-reassign */
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    // get the authentation token from storage if it exists
    const signedInUser = firebase.auth().currentUser;
    if (signedInUser) {
      signedInUser.getIdToken()
        .then((idToken) => {
          sessionStorage.setItem('token', idToken);
          req.options.headers.authorization = sessionStorage.getItem('token');
          next();
        }, (error) => {
          console.log(`REFRESH TOKEN ERROR: ${JSON.stringify(error)}`);
        });
    } else {
      req.options.headers.authorization = sessionStorage.getItem('token') || null;
      next();
    }
  },
}]);
/* eslint-enable no-param-reassign */

export const client = new ApolloClient({
  networkInterface,
});

export const apollo = client.reducer();
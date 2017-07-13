import { combineReducers } from 'redux';

// Import Reducers
import auth from './utilities/auth/authReducers';
import modal from './app/modal/modalReducers';
import { apollo } from './utilities/gqlClient';

const reducers = combineReducers({ auth, modal, apollo });

export default reducers;


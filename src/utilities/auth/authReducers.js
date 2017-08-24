import { combineReducers } from 'redux';
import { USER_LOGGED_IN, USER_LOGGED_OUT, LOGIN_LINK_CLICKED, CLOSE_MODAL_CLICKED } from './authConstants';
const objectAssign = require('object-assign');

const initialUserState = {
  loggedIn: false,
  privilege: 0,
};

const user = (state = initialUserState, action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      {
        return objectAssign({}, state, {
          loggedIn: true,
          privilege: action.data.privilege,
          name: action.data.name,
          email: action.data.email,
          provider: action.data.providerId,
          token: action.data.token,
          logout: action.data.logout,
        });
      }
    case USER_LOGGED_OUT:
      {
        return objectAssign({}, state, {
          loggedIn: false,
          privilege: 0,
        });
      }
    default:
      return state;
  }
};

const initialModalState = { open: false, loginPending: false };

const modal = (state = initialModalState, action) => {
  switch (action.type) {
    case LOGIN_LINK_CLICKED:
      {
        return objectAssign({}, state, {
          open: true,
        });
      }
    case CLOSE_MODAL_CLICKED:
      return objectAssign({}, state, {
        open: false,
      });
    default:
      return state;
  }
};

const auth = combineReducers({ user, modal });

export default auth;

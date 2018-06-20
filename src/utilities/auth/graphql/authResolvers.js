import { getUser, getModalOpen } from './authQueries';

export const authResolvers = {
  Mutation: {
    updateUser: (_, { loggedIn, privilege, name, email, provider }, { cache }) => {
      const data = {
        user: {
          __typename: 'user',
          loggedIn,
          privilege,
          name,
          email,
          provider,
        },
      };
      cache.writeQuery({ query: getUser, data });
      return data.user;
    },
    updateAuthModal: (_, { open }, { cache }) => {
      const data = {
        modal: {
          __typename: 'authModal',
          open,
        },
      };
      cache.writeQuery({ query: getModalOpen, data });
      return data.modal;
    },
  },
};

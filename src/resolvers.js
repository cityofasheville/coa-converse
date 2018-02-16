import { authResolvers } from './utilities/auth/graphql/authResolvers';

export const resolvers = {
  Mutation: Object.assign({}, authResolvers.Mutation),
};

import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { UserDAO } from '../dao';
import bcrypt from 'bcryptjs';
import { logger } from '../utils';

const Query = {
  currentUser: async (parent, args, context, info) => {
    if (!context.user) {
      // logger.error(`[QUERY: currentUser]: User object not present in request, please login`);
      throw new AuthenticationError(`User not identified`);
    }
    return await UserDAO.findById(context.user.id);
  },

  user: async (_, {id}, ctx) => {
    return await UserDAO.findById(id)
  },

  users: async (_, {}, ctx) => {
    console.log('users')
    return await UserDAO.findAll();
  },
}

const Mutation = {
  createUser: async (_, {input}) => {
    const foundUser = await UserDAO.findUserByEmail(input.email);
    // logger.info(`[MUTATION: createUser]:Creating user with email: ${input.email}`);
    if (foundUser) {
      throw new ApolloError(`User with email: ${input.email} alreayd exists`, 'CONFLICT');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(input.password, salt);
    await UserDAO.create({ ...input, password: hash });
    return await UserDAO.findUserByEmail(input.email);
  },

  deleteUser: async (_, {id}) => await UserDAO.delete(id),
  
  updateUser: async (_, {id, input}) => await UserDAO.update(id, input),
}

export default {
  Query,
  Mutation
} 
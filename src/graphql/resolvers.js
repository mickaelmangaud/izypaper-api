import { UserDAO } from '../dao';
import { UnauthorizedError } from '../error';

const Query = {
  currentUser: async (parent, args, context, info) => {
    return await UserDAO.findById(context.user.id);
  },
  user: async (_, {id}, ctx) => {
    if (!ctx.user) {
      throw new UnauthorizedError('Pas authorisé')
    }

    return await UserDAO.findById(id)
  },
  users: async (_, {}, ctx) => {
    // if (!ctx.user) {
    //   throw new UnauthorizedError('Pas authorisé')
    // }
    return await UserDAO.findAll();
  },
}

const Mutation = {
  createUser: async (_, {input}) => await UserDAO.create(input),
  deleteUser: async (_, {id}) => await UserDAO.delete(id),
  updateUser: async (_, {id, input}) => await UserDAO.update(id, input),
}

export default {
  Query,
  Mutation
}
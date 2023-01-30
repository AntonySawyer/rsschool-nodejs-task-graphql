import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../../context";
import { CreateUserInputType, UpdateUserInputType, UserType } from "./usersType";

type CreateUserArgs = {
  data: Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
};

type UpdateUserArgs = {
  data: Omit<UserEntity, 'subscribedToUserIds'>;
};

const getFieldCreateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: new GraphQLNonNull(CreateUserInputType)
    }
  },
  resolve: async (source, args, context) => {
    const { data: newUserBody } = args;
    const { fastify } = context;

    const createdUser = await fastify.db.users.create(newUserBody);

    return createdUser;
  },
});

const getFieldUpdateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, UpdateUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: UpdateUserInputType
    }
  },
  resolve: async (source, args, context) => {
    const { id: userId, ...updatedUserBody } = args.data;
    const { fastify, reply } = context;

    const originalUser = await fastify.db.users.findOne({
      equals: userId,
      key: 'id',
    });

    if (!originalUser) {
      reply.badRequest();

      return;
    }

    const mergedUserBody: UserEntity = {
      ...originalUser,
      ...updatedUserBody,
      id: userId,
    };

    const updatedUser = await fastify.db.users.change(userId, mergedUserBody);

    return updatedUser;
  },
});

export const getUserMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createUser: getFieldCreateUser(),
  updateUser: getFieldUpdateUser(),
});

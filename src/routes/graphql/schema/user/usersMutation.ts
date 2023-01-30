import { GraphQLFieldConfig, GraphQLString, ThunkObjMap } from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../../context";
import { UserType } from "./usersType";

type CreateUserArgs = Omit<UserEntity, 'id' | 'subscribedToUserIds'>;

const getFieldCreateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateUserArgs> => ({
  type: UserType,
  args: {
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    }, 
    email: {
      type: GraphQLString
    },
  },
  resolve: async (source, args, context) => {
    const newUserBody = args;
    const { fastify } = context;

    const createdUser = await fastify.db.users.create(newUserBody);

    return createdUser;
  },
});

export const getUserMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createUser: getFieldCreateUser(),
});

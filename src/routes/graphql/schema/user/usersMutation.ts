import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../../context";
import { UserInputType, UserType } from "./usersType";

type CreateUserArgs = {
  data: Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
};

const getFieldCreateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: new GraphQLNonNull(UserInputType)
    }
  },
  resolve: async (source, args, context) => {
    const { data: newUserBody } = args;
    const { fastify } = context;

    const createdUser = await fastify.db.users.create(newUserBody);

    return createdUser;
  },
});

export const getUserMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createUser: getFieldCreateUser(),
});

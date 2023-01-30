import { 
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { GraphQlContext } from "../../context";
import { UserType } from "./usersType";

type UserArgs = {
  id: string;
}

const getFieldAllUsers = (): GraphQLFieldConfig<unknown, GraphQlContext> => ({
  type: new GraphQLList<typeof UserType>(UserType),
  resolve: async (source, args, context, info) => {
    const { fastify } = context;

    const users = await fastify.db.users.findMany();

    return users;
  }
});

const getFieldSingleUserById = (): GraphQLFieldConfig<unknown, GraphQlContext, UserArgs> => ({
  type: UserType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (source, args, context, info) => {
    const { id } = args;
    const { fastify, reply } = context;

    const user = await fastify.db.users.findOne({
      equals: id,
      key: 'id',
    });

    if (!user) {
      reply.badRequest()

      return;
    }

    return user;
  }
});

export const getUserQueryFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  users: getFieldAllUsers(),
  user: getFieldSingleUserById(),
});

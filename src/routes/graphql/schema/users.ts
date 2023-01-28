import { 
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../context";

type UserArgs = {
  id: string;
}
const UserType = new GraphQLObjectType<UserEntity, GraphQlContext>({
  name: 'user',
  fields: {
    id: {
      type: GraphQLID, // TODO: format: uuid
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }
});

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

export const getUserFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  users: getFieldAllUsers(),
  user: getFieldSingleUserById(),
});

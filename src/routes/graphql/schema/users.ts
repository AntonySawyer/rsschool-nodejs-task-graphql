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
import { MemberTypeType } from "./memberTypes";
import { PostType } from "./posts";
import { ProfileType } from "./profiles";

type UserArgs = {
  id: string;
}

const UserType: GraphQLObjectType<UserEntity, GraphQlContext> = new GraphQLObjectType<UserEntity, GraphQlContext>({
  name: 'user',
  fields: () => ({
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
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source, args, context) => {
        const { id: userId } = source;
        const { fastify } = context;

        const posts = await fastify.db.posts.findMany({
          equals: userId,
          key: 'userId',
        });

        return posts;
      }
    },
    profile: {
      type: new GraphQLList(ProfileType),
      resolve: async (source, args, context) => {
        const { id: userId } = source;
        const { fastify } = context;

        const profiles = await fastify.db.profiles.findMany({
          equals: userId,
          key: 'userId',
        });

        return profiles;
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (source, args, context) => {
        const { id: userId } = source;
        const { fastify } = context;

        const profiles = await fastify.db.profiles.findMany({
          equals: userId,
          key: 'userId',
        });

        const memberTypes = [];

        for await (const profile of profiles) {
          const memberTypeForProfile = await fastify.db.memberTypes.findMany({
            equals: profile.memberTypeId,
            key: 'id',
          });

          memberTypes.push(memberTypeForProfile);
        }

        return memberTypes;
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, context) => {
        const { id: userId } = source;
        const { fastify } = context;

        const userSubscribedToUsers = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: userId,
        });

        return userSubscribedToUsers;
      }
    }
  })
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

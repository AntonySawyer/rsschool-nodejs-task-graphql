import { 
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../../context";
import { MemberTypeType } from "../memberType/memberTypeType";
import { PostType } from "../post/postsType";
import { ProfileType } from "../profile/profilesType";

export const UserType: GraphQLObjectType<UserEntity, GraphQlContext> = new GraphQLObjectType<UserEntity, GraphQlContext>({
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
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, context) => {
        const { subscribedToUserIds } = source;
        const { fastify } = context;

        const subscribedToUser = [];

        for await (const userId of subscribedToUserIds) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: userId,
          });

          subscribedToUser.push(user);
        }

        return subscribedToUser;
      }
    }
  })
});


export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }
});

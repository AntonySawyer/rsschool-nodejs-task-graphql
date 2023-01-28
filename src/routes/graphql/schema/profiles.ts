import { 
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../context";

type ProfileArgs = {
  id: string;
}
const ProfileType = new GraphQLObjectType<ProfileEntity, GraphQlContext>({
  name: 'profile',
  fields: {
    id: {
      type: GraphQLID, // TODO: format: uuid
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLInt,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString, // TODO: format: uuid
    }, 
  }
});

const getFieldAllProfiles = (): GraphQLFieldConfig<unknown, GraphQlContext> => ({
  type: new GraphQLList<typeof ProfileType>(ProfileType),
  resolve: async (source, args, context, info) => {
    const { fastify } = context;

    const profiles = await fastify.db.profiles.findMany();

    return profiles;
  }
});

const getFieldSingleProfileById = (): GraphQLFieldConfig<unknown, GraphQlContext, ProfileArgs> => ({
  type: ProfileType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (source, args, context, info) => {
    const { id } = args;
    const { fastify, reply } = context;

    const profile = await fastify.db.profiles.findOne({
      equals: id,
      key: 'id',
    });

    if (!profile) {
      reply.badRequest()

      return;
    }

    return profile;
  }
});

export const getProfileFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  profiles: getFieldAllProfiles(),
  profile: getFieldSingleProfileById(),
});

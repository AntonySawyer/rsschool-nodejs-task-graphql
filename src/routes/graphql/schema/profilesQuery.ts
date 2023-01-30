import { 
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { GraphQlContext } from "../context";
import { ProfileType } from "./profilesType";

type ProfileArgs = {
  id: string;
}

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

export const getProfileQueryFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  profiles: getFieldAllProfiles(),
  profile: getFieldSingleProfileById(),
});

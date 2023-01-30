import { GraphQLFieldConfig, GraphQLInt, GraphQLString, ThunkObjMap } from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../../context";
import { ProfileType } from "./profilesType";

type CreateProfileArgs = Omit<ProfileEntity, 'id'>;

const getFieldCreateProfile = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateProfileArgs> => ({
  type: ProfileType,
  args: {
    avatar: {
      type: GraphQLString
    },
    sex: {
      type: GraphQLString
    },
    birthday: {
      type: GraphQLInt
    },
    country: {
      type: GraphQLString
    },
    street: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    memberTypeId: {
      type: GraphQLString
    },
    userId: {
      type: GraphQLString
    },
  },
  resolve: async (source, args, context) => {
    const newProfileBody = args;
    const { fastify } = context;

    const createdProfile = await fastify.db.profiles.create(newProfileBody);

    return createdProfile;
  },
});

export const getProfileMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createProfile: getFieldCreateProfile(),
});

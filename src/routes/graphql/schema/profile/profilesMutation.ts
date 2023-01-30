import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../../context";
import { ProfileInputType, ProfileType } from "./profilesType";

type CreateProfileArgs = {
  data: Omit<ProfileEntity, 'id'>;
};

const getFieldCreateProfile = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateProfileArgs> => ({
  type: ProfileType,
  args: {
    data: {
      type: new GraphQLNonNull(ProfileInputType),
    }
  },
  resolve: async (source, args, context) => {
    const { data: newProfileBody } = args;
    const { fastify } = context;

    const createdProfile = await fastify.db.profiles.create(newProfileBody);

    return createdProfile;
  },
});

export const getProfileMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createProfile: getFieldCreateProfile(),
});

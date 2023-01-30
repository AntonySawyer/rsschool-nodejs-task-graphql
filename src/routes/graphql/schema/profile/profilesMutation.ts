import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../../context";
import { CreateProfileInputType, ProfileType, UpdateProfileInputType } from "./profilesType";

type CreateProfileArgs = {
  data: Omit<ProfileEntity, 'id'>;
};

type UpdateProfileArgs = {
  data: ProfileEntity;
}

const getFieldCreateProfile = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateProfileArgs> => ({
  type: ProfileType,
  args: {
    data: {
      type: new GraphQLNonNull(CreateProfileInputType),
    }
  },
  resolve: async (source, args, context) => {
    const { data: newProfileBody } = args;
    const { fastify } = context;

    const createdProfile = await fastify.db.profiles.create(newProfileBody);

    return createdProfile;
  },
});

const getFieldUpdateProfile = (): GraphQLFieldConfig<unknown, GraphQlContext, UpdateProfileArgs> => ({
  type: ProfileType,
  args: {
    data: {
      type: UpdateProfileInputType
    }
  },
  resolve: async (source, args, context) => {
    const { id: profileId, ...updatedProfileBody } = args.data;
    const { fastify, reply } = context;

    const originalProfile = await fastify.db.profiles.findOne({
      equals: profileId,
      key: 'id',
    });

    if (!originalProfile) {
      reply.badRequest();

      return;
    }

    const mergedProfileBody: ProfileEntity = {
      ...originalProfile,
      ...updatedProfileBody,
      id: profileId,
    };

    const updatedProfile = await fastify.db.profiles.change(profileId, mergedProfileBody);

    return updatedProfile;
  },
});

export const getProfileMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createProfile: getFieldCreateProfile(),
  updateProfile: getFieldUpdateProfile(),
});

import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    const profiles = await fastify.db.profiles.findMany();

    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const { id: profileId } = request.params;

      const profile = await fastify.db.profiles.findOne({
        equals: profileId,
        key: 'id',
      });

      if (!profile) {
        reply.notFound();

        return;
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const newProfileRequest = request.body;

      try {
        const memberType = await fastify.db.memberTypes.findOne({
          equals: newProfileRequest.memberTypeId,
          key: 'id',
        });

        if (!memberType) {
          reply.badRequest('Member type not exist');

          return;
        }

        const userProfile = await fastify.db.profiles.findOne({
          equals: newProfileRequest.userId,
          key: 'userId',
        });

        if (userProfile) {
          reply.badRequest('User already have profile');

          return;
        }

        const newProfile = await fastify.db.profiles.create(newProfileRequest);
        
        return newProfile;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const { id: idToDelete } = request.params;

      try {
        const deletedProfile = await fastify.db.profiles.delete(idToDelete);

        return deletedProfile;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const { id: profileId } = request.params;
      const updatedFields = request.body;

      try {
        const originalProfile = await fastify.db.profiles.findOne({
          equals: profileId,
          key: 'id',
        });

        if (!originalProfile) {
          reply.badRequest('Profile not exist');

          return;
        }

        const updatedProfile: ProfileEntity = {
          ...originalProfile,
          avatar: updatedFields.avatar ?? originalProfile?.avatar,
          birthday: updatedFields.birthday ?? originalProfile?.birthday,
          city: updatedFields.city ?? originalProfile?.city,
          country: updatedFields.country ?? originalProfile?.country,
          memberTypeId: updatedFields.memberTypeId ?? originalProfile?.memberTypeId,
          sex: updatedFields.sex ?? originalProfile?.sex,
          street: updatedFields.street ?? originalProfile?.street,
        };

        await fastify.db.profiles.change(profileId, updatedProfile);

        return updatedProfile;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );
};

export default plugin;

import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany();

    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const { id: userId } = request.params;

      const user = await fastify.db.users.findOne({
        equals: userId,
        key: 'id'
      });

      if (!user) {
        reply.notFound();

        return;
      }

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const newUserRequest = request.body;

      try {
        const newUser = await fastify.db.users.create(newUserRequest);

        return newUser
      } catch (error) {
        reply.badRequest(error as string)
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
    async function (request, reply): Promise<UserEntity | void> {
      const { id: userToDeleteId } = request.params;

      try {
        const deletedUser = await fastify.db.users.delete(userToDeleteId);
        const shouldUnsubscribeUserIds = deletedUser.subscribedToUserIds;

        // TODO: fix "cascade" unsubscribing
        for await (const userId of shouldUnsubscribeUserIds) {
          const userUnsubscribeFrom = await fastify.db.users.findOne({
            equals: userId,
            key: 'id'
          });

          console.log('userUnsubscribeFrom?.subscribedToUserIds: ', userUnsubscribeFrom?.subscribedToUserIds);

          const modifiedSubscribeIds = userUnsubscribeFrom?.subscribedToUserIds.filter((id) => (
            id !== userToDeleteId
          ));

          console.log('modifiedSubscribeIds: ', modifiedSubscribeIds);

          await fastify.db.users.change(userId, {
            subscribedToUserIds: modifiedSubscribeIds
          });
        }

        return deletedUser;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const { id: originalUserId } = request.params;
      const { userId: subscribeToUserId } = request.body;

      try {
        const originalUser = await fastify.db.users.findOne({
          equals: originalUserId,
          key: 'id'
        });

        const subscribeToUser = await fastify.db.users.findOne({
          equals: subscribeToUserId,
          key: 'id'
        });

        if (!subscribeToUser || !originalUser) {
          reply.notFound();

          return;
        }

        const existedSubscribeToIds = subscribeToUser.subscribedToUserIds ?? [];
        const updatedUserSubscribeIds = [...existedSubscribeToIds];

        if (!existedSubscribeToIds.includes(originalUserId)) {
          updatedUserSubscribeIds.push(originalUserId);
        }

        const updatedUser = await fastify.db.users.change(subscribeToUserId, {
          subscribedToUserIds: updatedUserSubscribeIds
        });

        return updatedUser;
      } catch (error) {
        reply.badRequest(error as string);        
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const { id: originalUserId } = request.params;
      const { userId: unsubscribeFromUserId } = request.body;

      try {
        const originalUser = await fastify.db.users.findOne({
          equals: originalUserId,
          key: 'id'
        });

        const unsubscribeFromUser = await fastify.db.users.findOne({
          equals: unsubscribeFromUserId,
          key: 'id'
        });

        if (!originalUser || !unsubscribeFromUser) {
          reply.notFound();

          return;
        }

        const existedSubscribeToIds = unsubscribeFromUser.subscribedToUserIds ?? [];

        if (!existedSubscribeToIds.includes(originalUserId)) {
          reply.badRequest('User no subscribed to this user.');

          return;
        }

        const updatedUserSubscribeIds = existedSubscribeToIds.filter((id) => (
          id !== originalUserId
        ));

        const updatedUser = await fastify.db.users.change(unsubscribeFromUserId, {
          subscribedToUserIds: updatedUserSubscribeIds
        });

        return updatedUser;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const { id: userId } = request.params;
      const updatedFields = request.body;

      const originalUser = await fastify.db.users.findOne({
        equals: userId,
        key: 'id',
      });

      if (!originalUser) {
        reply.badRequest('User not exist');

        return;
      }

      const updatedUser: UserEntity = {
        ...originalUser,
        email: updatedFields.email ?? originalUser?.email,
        firstName: updatedFields.firstName ?? originalUser.firstName,
        lastName: updatedFields.lastName ?? originalUser.lastName,
      };

      try {
        await fastify.db.users.change(userId, updatedUser);

        return updatedUser;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );
};

export default plugin;

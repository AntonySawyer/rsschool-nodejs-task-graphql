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

        const profileToDelete = await fastify.db.profiles.findOne({
          equals: deletedUser.id,
          key: 'userId',
        });

        const postsToDelete = await fastify.db.posts.findMany({
          equals: deletedUser.id,
          key: 'userId',
        });

        const usersToUnsubscribe = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: deletedUser.id,
        });

        if (profileToDelete) {
          await fastify.db.profiles.delete(profileToDelete.id);
        }

        for await (const post of postsToDelete) {
          await fastify.db.posts.delete(post.id);
        }

        for await (const user of usersToUnsubscribe) {
          const modifiedSubscribeIds = user.subscribedToUserIds.filter((id) => (
            id !== userToDeleteId
          ));

          await fastify.db.users.change(user.id, {
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
      const { id: idUserSubscribeTo } = request.params;
      const { userId: idUserWhoSubscribe } = request.body;

      try {
        const userSubscribeTo = await fastify.db.users.findOne({
          equals: idUserSubscribeTo,
          key: 'id'
        });

        const userWhoSubscribe = await fastify.db.users.findOne({
          equals: idUserWhoSubscribe,
          key: 'id'
        });

        if (!userWhoSubscribe || !userSubscribeTo) {
          reply.notFound();

          return;
        }

        const existedSubscribeToIds = userWhoSubscribe.subscribedToUserIds ?? [];
        const updatedUserSubscribeIds = [...existedSubscribeToIds];

        if (!existedSubscribeToIds.includes(idUserSubscribeTo)) {
          updatedUserSubscribeIds.push(idUserSubscribeTo);
        }

        const updatedUser = await fastify.db.users.change(idUserWhoSubscribe, {
          subscribedToUserIds: updatedUserSubscribeIds,
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

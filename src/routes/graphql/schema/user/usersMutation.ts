import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { GraphQlContext } from "../../context";
import { CreateUserInputType, SubscribeUserToInputType, UnubscribeUserFromInputType, UpdateUserInputType, UserType } from "./usersType";

type CreateUserArgs = {
  data: Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
};

type UpdateUserArgs = {
  data: Omit<UserEntity, 'subscribedToUserIds'>;
};

type SubscribeUserArgs = {
  data: {
    whoSubscribeId: string;
    subscribeToId: string;
  };
};

type UnsubscribeUserArgs = {
  data: {
    whoUnsubscribeId: string;
    unsubscribeFromId: string;
  }
};

const getFieldCreateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, CreateUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: new GraphQLNonNull(CreateUserInputType)
    }
  },
  resolve: async (source, args, context) => {
    const { data: newUserBody } = args;
    const { fastify } = context;

    const createdUser = await fastify.db.users.create(newUserBody);

    return createdUser;
  },
});

const getFieldUpdateUser = (): GraphQLFieldConfig<unknown, GraphQlContext, UpdateUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: UpdateUserInputType
    }
  },
  resolve: async (source, args, context) => {
    const { id: userId, ...updatedUserBody } = args.data;
    const { fastify, reply } = context;

    const originalUser = await fastify.db.users.findOne({
      equals: userId,
      key: 'id',
    });

    if (!originalUser) {
      reply.badRequest();

      return;
    }

    const mergedUserBody: UserEntity = {
      ...originalUser,
      ...updatedUserBody,
      id: userId,
    };

    const updatedUser = await fastify.db.users.change(userId, mergedUserBody);

    return updatedUser;
  },
});

const getFieldSubscribeUser = (): GraphQLFieldConfig<unknown, GraphQlContext, SubscribeUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: SubscribeUserToInputType
    }
  },
  resolve: async (source, args, context) => {
    const { subscribeToId, whoSubscribeId } = args.data;
    const { fastify, reply } = context;

    const userSubscribeTo = await fastify.db.users.findOne({
      equals: subscribeToId,
      key: 'id',
    });

    const userWhoSubscribe = await fastify.db.users.findOne({
      equals: whoSubscribeId,
      key: 'id',
    });

    if (!userSubscribeTo || !userWhoSubscribe) {
      reply.badRequest();

      return;
    }

    const existedSubscribeToIds = userWhoSubscribe.subscribedToUserIds ?? [];
    const updatedUserSubscribeIds = [...existedSubscribeToIds];

    if (!existedSubscribeToIds.includes(subscribeToId)) {
      updatedUserSubscribeIds.push(subscribeToId);
    }

    const updatedUserWhoSubscribed = await fastify.db.users.change(whoSubscribeId, {
      subscribedToUserIds: updatedUserSubscribeIds,
    });

    return updatedUserWhoSubscribed;
  },
});

const getFieldUnsubscribeUser = (): GraphQLFieldConfig<unknown, GraphQlContext, UnsubscribeUserArgs> => ({
  type: UserType,
  args: {
    data: {
      type: UnubscribeUserFromInputType
    }
  },
  resolve: async (source, args, context) => {
    const { unsubscribeFromId, whoUnsubscribeId } = args.data;
    const { fastify, reply } = context;

    const userWhoUnsubscribe = await fastify.db.users.findOne({
      equals: whoUnsubscribeId,
      key: 'id',
    });

    const userUnsubscribeFrom = await fastify.db.users.findOne({
      equals: unsubscribeFromId,
      key: 'id',
    });

    if (!userWhoUnsubscribe || !userUnsubscribeFrom) {
      reply.badRequest();

      return;
    }

    const existedSubscribeToIds = userWhoUnsubscribe.subscribedToUserIds ?? [];
    const updatedUserSubscribeIds = existedSubscribeToIds.filter((id) => (
      id !== unsubscribeFromId
    ));

    const updatedUserWhoUnsubscribed = await fastify.db.users.change(whoUnsubscribeId, {
      subscribedToUserIds: updatedUserSubscribeIds,
    });

    return updatedUserWhoUnsubscribed;
  },
});

export const getUserMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createUser: getFieldCreateUser(),
  updateUser: getFieldUpdateUser(),
  subscribeUser: getFieldSubscribeUser(),
  unSubscribeUser: getFieldUnsubscribeUser(),
});

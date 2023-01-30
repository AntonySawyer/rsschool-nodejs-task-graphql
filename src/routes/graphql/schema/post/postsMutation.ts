import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { GraphQlContext } from "../../context";
import { CreatePostInputType, PostType, UpdatePostInputType } from "./postsType";

type CreatePostArgs = {
  data: Omit<PostEntity, 'id'>;
};

type UpdatePostArgs = {
  data: PostEntity;
};

const getFieldCreatePost = (): GraphQLFieldConfig<unknown, GraphQlContext, CreatePostArgs> => ({
  type: PostType,
  args: {
    data: {
      type: new GraphQLNonNull(CreatePostInputType)
    }
  },
  resolve: async (source, args, context) => {
    const { data: newPostBody } = args;
    const { fastify } = context;

    const createdPost = await fastify.db.posts.create(newPostBody);

    return createdPost;
  },
});

const getFieldUpdatePost = (): GraphQLFieldConfig<unknown, GraphQlContext, UpdatePostArgs> => ({
  type: PostType,
  args: {
    data: {
      type: UpdatePostInputType
    }
  },
  resolve: async (source, args, context) => {
    const { id: postId, ...updatedBody } = args.data;
    const { fastify, reply } = context;

    const originalPost = await fastify.db.posts.findOne({
      equals: postId,
      key: 'id',
    });

    if (!originalPost) {
      reply.badRequest();

      return;
    }

    const mergedBody: PostEntity = {
      ...originalPost,
      ...updatedBody,
      id: postId,
    };

    const updatedEntity = await fastify.db.posts.change(postId, mergedBody);

    return updatedEntity;
  },
});

export const getPostMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createPost: getFieldCreatePost(),
  updatePost: getFieldUpdatePost(),
});

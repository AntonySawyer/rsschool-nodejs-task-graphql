import { GraphQLFieldConfig, GraphQLNonNull, ThunkObjMap } from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { GraphQlContext } from "../../context";
import { CreatePostInputType, PostType } from "./postsType";

type CreatePostArgs = {
  data: Omit<PostEntity, 'id'>;
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

export const getPostMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  createPost: getFieldCreatePost(),
});

import { 
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { GraphQlContext } from "../context";
import { PostType } from "./postsType";

type PostArgs = {
  id: string;
}

const getFieldAllPosts = (): GraphQLFieldConfig<unknown, GraphQlContext> => ({
  type: new GraphQLList<typeof PostType>(PostType),
  resolve: async (source, args, context, info) => {
    const { fastify } = context;

    const posts = await fastify.db.posts.findMany();

    return posts;
  }
});

const getFieldSinglePostById = (): GraphQLFieldConfig<unknown, GraphQlContext, PostArgs> => ({
  type: PostType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (source, args, context, info) => {
    const { id } = args;
    const { fastify, reply } = context;

    const post = await fastify.db.posts.findOne({
      equals: id,
      key: 'id',
    });

    if (!post) {
      reply.badRequest();

      return;
    }

    return post;
  }
});

export const getPostQueryFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  posts: getFieldAllPosts(),
  post: getFieldSinglePostById()
});

import { 
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { GraphQlContext } from "../context";

type PostArgs = {
  id: string;
}

export const PostType = new GraphQLObjectType<PostEntity, GraphQlContext>({
  name: 'post',
  fields: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLID, // TODO: format: uuid
    }
  }
});

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

export const getPostFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  posts: getFieldAllPosts(),
  post: getFieldSinglePostById()
});

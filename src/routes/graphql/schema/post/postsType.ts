import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { GraphQlContext } from "../../context";

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
      type: GraphQLID,
    }
  }
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    }
  }
});

export const UpdatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString,
    }
  }
});

import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

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
      type: GraphQLID, // TODO: format: uuid
    }
  }
});

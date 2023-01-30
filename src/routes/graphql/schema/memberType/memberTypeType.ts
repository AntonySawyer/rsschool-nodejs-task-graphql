import { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLInputObjectType } from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { GraphQlContext } from "../../context";

export const MemberTypeType = new GraphQLObjectType<MemberTypeEntity, GraphQlContext>({
  name: 'memberType',
  fields: {
    id: {
      type: GraphQLID,
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }
});


export const UpdateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'UpdateMemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }
});

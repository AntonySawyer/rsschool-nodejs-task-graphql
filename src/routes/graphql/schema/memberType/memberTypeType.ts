import { GraphQLObjectType, GraphQLID, GraphQLInt } from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { GraphQlContext } from "../../context";

export const MemberTypeType = new GraphQLObjectType<MemberTypeEntity, GraphQlContext>({
  name: 'memberType',
  fields: {
    id: {
      type: GraphQLID, // TODO: format: uuid
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }
});

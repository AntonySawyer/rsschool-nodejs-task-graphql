import { 
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { GraphQlContext } from "../context";

type MemberTypeArgs = {
  id: string;
}
const MemberTypeType = new GraphQLObjectType<MemberTypeEntity, GraphQlContext>({
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

const getFieldAllMemberTypes = (): GraphQLFieldConfig<unknown, GraphQlContext> => ({
  type: new GraphQLList<typeof MemberTypeType>(MemberTypeType),
  resolve: async (source, args, context, info) => {
    const { fastify } = context;

    const memberTypes = await fastify.db.memberTypes.findMany();

    return memberTypes;
  }
});

const getFieldSingleMemberTypeById = (): GraphQLFieldConfig<unknown, GraphQlContext, MemberTypeArgs> => ({
  type: MemberTypeType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (source, args, context, info) => {
    const { id } = args;
    const { fastify, reply } = context;

    const post = await fastify.db.memberTypes.findOne({
      equals: id,
      key: 'id',
    });

    if (!post) {
      reply.badRequest()

      return;
    }

    return post;
  }
});

export const getMemberTypeFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  memberTypes: getFieldAllMemberTypes(),
  memberType: getFieldSingleMemberTypeById()
});

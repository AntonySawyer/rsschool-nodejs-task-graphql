import { 
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

import { GraphQlContext } from "../../context";
import { MemberTypeType } from "./memberTypeType";

type MemberTypeArgs = {
  id: string;
}

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

    const memberType = await fastify.db.memberTypes.findOne({
      equals: id,
      key: 'id',
    });

    if (!memberType) {
      reply.badRequest()

      return;
    }

    return memberType;
  }
});

export const getMemberTypeQueryFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  memberTypes: getFieldAllMemberTypes(),
  memberType: getFieldSingleMemberTypeById()
});

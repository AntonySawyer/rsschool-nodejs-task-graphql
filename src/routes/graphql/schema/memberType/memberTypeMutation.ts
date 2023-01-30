import { GraphQLFieldConfig, ThunkObjMap } from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { GraphQlContext } from "../../context";
import { MemberTypeType, UpdateMemberTypeInputType } from "./memberTypeType";

type UpdateMemberTypeArgs = {
  data: MemberTypeEntity;
}

const getFieldUpdateMemberType = (): GraphQLFieldConfig<unknown, GraphQlContext, UpdateMemberTypeArgs> => ({
  type: MemberTypeType,
  args: {
    data: {
      type: UpdateMemberTypeInputType
    }
  },
  resolve: async (source, args, context) => {
    const { id, ...updatedBody } = args.data;
    const { fastify, reply } = context;

    const originalEntity = await fastify.db.memberTypes.findOne({
      equals: id,
      key: 'id',
    });

    if (!originalEntity) {
      reply.badRequest();

      return;
    }

    const mergedBody: MemberTypeEntity = {
      ...originalEntity,
      ...updatedBody,
      id,
    };

    const updatedEntity = await fastify.db.memberTypes.change(id, mergedBody);

    return updatedEntity;
  },
});

export const getMemberTypeMutatuionFields = (): ThunkObjMap<GraphQLFieldConfig<unknown, GraphQlContext>> => ({
  updateMemberType: getFieldUpdateMemberType(),
});

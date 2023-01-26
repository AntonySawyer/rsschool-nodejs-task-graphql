import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[] | void
  > {
    const memberTypes = await fastify.db.memberTypes.findMany();

    return memberTypes;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | void> {
      const { id: memberTypeId } = request.params;
      const memberType = await fastify.db.memberTypes.findOne({
        equals: memberTypeId,
        key: 'id',
      });

      if (!memberType) {
        reply.notFound();

        return;
      }

      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | void> {
      const { id: memberTypeId } = request.params;
      const updatedFields = request.body;

      const originalMemberType = await fastify.db.memberTypes.findOne({
        equals: memberTypeId,
        key: 'id'
      });

      if (!originalMemberType) {
        reply.badRequest('Member type not exist');

        return;
      }

      const updatedMemberType: MemberTypeEntity = {
        ...originalMemberType,
        discount: updatedFields.discount ?? originalMemberType?.discount,
        monthPostsLimit: updatedFields.monthPostsLimit ?? originalMemberType?.monthPostsLimit,
      };

      try {
        await fastify.db.memberTypes.change(memberTypeId, updatedMemberType);

        return updatedMemberType;
      } catch (error) {
        reply.badRequest(error as string);
      }

    }
  );
};

export default plugin;

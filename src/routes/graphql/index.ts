import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQlContext } from './context';

import { graphqlBodySchema } from './schema';
import { getMemberTypeFields } from './schema/memberTypes';
import { getPostFields } from './schema/posts';
import { getProfileFields } from './schema/profiles';
import { getUserFields } from './schema/users';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const QueryType = new GraphQLObjectType<unknown, GraphQlContext>({
        name: 'Query',
        fields: {
          ...getPostFields(),
          ...getMemberTypeFields(),
          ...getProfileFields(),
          ...getUserFields(),
        },
      });

      const schema = new GraphQLSchema({
        query: QueryType,
      });

      const graphQlContext: GraphQlContext = {
        fastify,
        reply,
      };

      const result = graphql({
        schema,
        source: request.body.query as string,
        contextValue: graphQlContext
      });

      return result;
    }
  );
};

export default plugin;

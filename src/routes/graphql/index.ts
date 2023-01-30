import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQlContext } from './context';

import { graphqlBodySchema } from './schema';
import { getMemberTypeQueryFields } from './schema/memberTypesQuery';
import { getPostQueryFields } from './schema/postsQuery';
import { getProfileQueryFields } from './schema/profilesQuery';
import { getUserMutatuionFields } from './schema/usersMutation';
import { getUserQueryFields } from './schema/usersQuery';

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
          ...getPostQueryFields(),
          ...getMemberTypeQueryFields(),
          ...getProfileQueryFields(),
          ...getUserQueryFields(),
        },
      });

      const MutationType = new GraphQLObjectType<unknown, GraphQlContext>({
        name: 'Mutation',
        fields: {
          ...getUserMutatuionFields(),
        },
      });

      const schema = new GraphQLSchema({
        query: QueryType,
        mutation: MutationType
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

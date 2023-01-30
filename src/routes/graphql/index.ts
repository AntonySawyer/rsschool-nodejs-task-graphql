import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQlContext } from './context';

import { graphqlBodySchema } from './schema';
import { getMemberTypeQueryFields } from './schema/memberType/memberTypesQuery';
import { getPostMutatuionFields } from './schema/post/postsMutation';
import { getPostQueryFields } from './schema/post/postsQuery';
import { getProfileMutatuionFields } from './schema/profile/profilesMutation';
import { getProfileQueryFields } from './schema/profile/profilesQuery';
import { getUserMutatuionFields } from './schema/user/usersMutation';
import { getUserQueryFields } from './schema/user/usersQuery';

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
          ...getProfileMutatuionFields(),
          ...getPostMutatuionFields(),
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

import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();

    return posts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const { id: postId } = request.params;

      try {
        const post = await fastify.db.posts.findOne({
          equals: postId,
          key: 'id',
        });

        if (!post) {
          reply.notFound();

          return;
        }

        return post;
      } catch (error) {
        reply.badRequest(error as string);  
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const newPostRequest = request.body;

      try {
          const newPost = await fastify.db.posts.create(newPostRequest);

          return newPost;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const { id: idToDelete } = request.params;

      try {
        const deletedPost = await fastify.db.posts.delete(idToDelete);

        return deletedPost;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const { id: postId } = request.params;
      const updatedFields = request.body;

      try {
        const originalPost = await fastify.db.posts.findOne({
          equals: postId,
          key: 'id',
        });

        if (!originalPost) {
          reply.badRequest('Post not exist');

          return;
        }

        const updatedPost: PostEntity = {
          ...originalPost,
          content: updatedFields.content ?? originalPost.content,
          title: updatedFields.title ?? originalPost.title,
        };

        await fastify.db.posts.change(postId, updatedPost);

        return updatedPost;
      } catch (error) {
        reply.badRequest(error as string);
      }
    }
  );
};

export default plugin;

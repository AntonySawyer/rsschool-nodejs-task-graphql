import { FastifyInstance, FastifyReply } from "fastify";

export interface GraphQlContext {
  fastify: FastifyInstance;
  reply: FastifyReply;
}

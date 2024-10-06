/// <reference path="../global.d.ts" />
import { FastifyInstance, FastifyPluginOptions } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get(
    "/api/users/me",
    { preHandler: [fastify.authenticate] },
    async (req: any, reply: any) => {
      reply.type("text/html").send(
        `
        <h1>Profile</h1>
        <pre>${JSON.stringify(reply.user, null, 2)}</pre>
        <a href="/">Home</a>
    `
      );
    }
  );
}

/// <reference path="../global.d.ts" />
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.decorate("example", "foobar");
  fastify.addHook("onError", (request, reply, error, done) => {
    console.log("on authx error", error);
    // Some code
    done();
  });
}

/// <reference path="../global.d.ts" />
import { FastifyInstance, FastifyPluginOptions } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    // example: string;
  }
}

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/welcome", (req: any, reply: any) => {
    reply.type("text/html").send(
      `
            <h1>Welcome to Auth.js + Fastify Demo!</h1>
            <ol>
            <li>Sign in at <a href="/api/auth/signin">/api/auth/signin</a> </li>
            <li>Sign out at <a href="/api/auth/signout">/api/auth/signout</a> </li>
            <li>Access the current user at <a href="/api/users/me">/api/users/me</a> </li>
            </ol>
        `
    );
  });
}

import formbodyParser from "@fastify/formbody";
import GoogleProvider from "@auth/core/providers/google";
import CredentialsProvider from "@auth/core/providers/credentials";
// const GoogleProvider = import("@auth/core/providers/google");

// @ts-ignore
import { FastifyAuth, getSession } from "../authjs-fastify/index.js";

const config = {
  basePath: "/authx/api/auth",
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize({ request }) {
        const response = await fetch(request);
        if (!response.ok) return null;
        return (await response.json()) ?? null;
      },
    }),
    GoogleProvider,
  ],
};

const AuthPlugin = FastifyAuth(config);
const authjs = async function (fastify: any, opts: any) {
  fastify.register(formbodyParser);
  // fastify.decorate("authjs", "foobar");
  fastify.register(AuthPlugin, { prefix: "/api/auth" });
  // console.log(opts);

  fastify.decorate("authenticate", async (req: any, reply: any) => {
    const session = await getSession(req, config);
    if (!session) {
      reply.status(403).send("Unauthorized");
      return;
    }
    reply.user = session?.user; // Decorating the reply object
  });
};

export default authjs;

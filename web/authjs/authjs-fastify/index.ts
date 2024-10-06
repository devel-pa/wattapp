import { Auth, setEnvDefaults, createActionURL } from "@auth/core";
import type { AuthConfig, Session } from "@auth/core/types";
import type { FastifyRequest, FastifyPluginAsync } from "fastify";
import formbody from "@fastify/formbody";
import { toWebRequest, toFastifyReply } from "./lib/index.js";

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types";

export function FastifyAuth(
  config: Omit<AuthConfig, "raw">
): FastifyPluginAsync {
  setEnvDefaults(process.env, config);
  return async (fastify) => {
    if (!fastify.hasContentTypeParser("application/x-www-form-urlencoded")) {
      fastify.register(formbody);
    }
    fastify.route({
      method: ["GET", "POST"],
      url: "/*",
      handler: async (request, reply) => {
        console.log("0. handle request", request.routeOptions);
        config.basePath = config.basePath || getBasePath(request);
        // @ts-ignore
        let response: Response = {};
        try {
          console.log("1.==>");
          response = await Auth(toWebRequest(request), config);
        } catch (err) {
          console.log("ddd==>>", err);
        }
        return toFastifyReply(response, reply);
      },
    });
  };
}

export type GetSessionResult = Promise<Session | null>;

export async function getSession(
  req: FastifyRequest,
  config: Omit<AuthConfig, "raw">
): GetSessionResult {
  setEnvDefaults(process.env, config);
  const cfg: Pick<AuthConfig, "logger" | "basePath"> = config;
  const url = createActionURL(
    "session",
    req.protocol,
    // @ts-expect-error
    new Headers(req.headers),
    process.env,
    cfg
  );
  req.log.info("6=>", url);
  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.cookie ?? "" } }),
    config
  );

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

function getBasePath(req: FastifyRequest) {
  // console.log("===>", req);
  // req.log.info("xxx>>>", req.routeOptions.config.url.split("/*")[0]);
  return req.routeOptions.config.url.split("/*")[0];
}

import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyNext from "@fastify/nextjs";
import "dotenv/config";

const dirPath: string = process.env.TARGET_PATH as string;

async function run() {
  const server = fastify();

  server.register(fastifyStatic, { root: dirPath, prefix: "/static" });
  server.register(fastifyNext).after(() => {
    server.next("/*", (app, request, reply) => {
      const [pathname, queryString] = request.url.split("?");

      return app.render(
        request.raw,
        reply.raw,
        pathname,
        Object.fromEntries(new URLSearchParams(queryString)),
      );
    });
  });

  server
    .listen({ port: +process.env.PORT! || 3000, host: "0.0.0.0" })
    .then(() => console.log("server start"));
}

run();

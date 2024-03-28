import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyNext from "@fastify/nextjs";
import "dotenv/config";

const dirPath: string = process.env.TARGET_PATH as string;

async function run() {
  const app = fastify();

  app.register(fastifyStatic, { root: dirPath, prefix: "/static" });
  app.register(fastifyNext).after(() => {
    app.next("/*", (app, request, reply) => {
      const url = new URL(
        `${request.protocol}://${request.hostname}${request.url}`,
      );
      console.log("Url", url.pathname, url.searchParams);

      return app.render(request.raw, reply.raw, url.pathname, {});
    });
  });

  app.listen({ port: 3000 }).then(() => console.log("server start"));
}

run();

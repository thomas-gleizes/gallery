import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyNext from "@fastify/nextjs";
import "dotenv/config";

const dirPath: string = process.env.TARGET_PATH as string;

async function run() {
  const app = fastify();

  app.register(fastifyStatic, { root: dirPath, prefix: "/static" });
  app.register(fastifyNext, { noServeAssets: false, dev: true }).after(() => {
    app.next("/*", (app, request, reply) => {
      console.log("path", request.url);
      return app.render(request.raw, reply.raw, request.url, request.query, {});
    });
  });

  app.listen({ port: 3000 }).then(() => console.log("server start"));
}

run();

import fs from "node:fs";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyNext from "@fastify/nextjs";
import "dotenv/config";
import { dirname } from "node:path";
import scan, { readCache, saveCache } from "@/utils/scan";
import { DirectoryType, FilesTypes } from "../types";

const dirPath: string = process.env.TARGET_PATH as string;
process.env.STATIC_PATH = `${dirname(__dirname)}/static`;

async function bootstrap() {
  let FILES = await readCache();

  fs.watch(dirPath, { recursive: true }, async (eventType, filename) => {
    try {
      if (eventType === "change") return;
      if (filename === ".DS_Store" || !filename) return;

      const filePath = `${dirPath}/${filename}`;
      const isExist = fs.existsSync(filePath);
      const paths = filename.split("/");
      console.log(eventType, filename, isExist);

      if (isExist) {
        let current: FilesTypes = FILES;
        const isDirectory = await fs.promises
          .lstat(filePath)
          .then((stat) => stat.isDirectory());

        let targetPath = dirPath;
        for (const path of paths) {
          let find = current.find((file) => file.name === path);

          console.log("Find", !!find);

          if (find && find.type === "directory") {
            current = find.files;
          } else {
            console.log("Current", current);
            if (isDirectory) {
              console.log("DIR");
              const test = await scan(filePath);

              console.log("DIRECTORY", test);
            } else {
              console.log("FILE");
              const test = await scan(targetPath);
              console.log("FILE", test);

              current.slice(0, current.length - 1);
              console.log("Current", current);
              current.push(...test);
            }
          }

          targetPath += `/${path}`;
        }
      } else {
        const paths = filename.split("/");

        let current = FILES;
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const index = current.findIndex((file) => file.name === path)!;
          const finded = current[index];

          if (i === paths.length - 1) {
            console.log("SUPPR", finded.name);
            current.splice(index, 1);
            break;
          }

          if (finded.type === "directory") {
            current = finded.files;
          }
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  });

  const server = fastify();

  server.get("/api/scan", async (request, reply) => {
    const [, queryString] = request.url.split("?");
    const urlSearchParams = new URLSearchParams(queryString);

    if (urlSearchParams.has("latest")) {
      FILES = await scan(process.env.TARGET_PATH as string);
      void saveCache(FILES);
    }

    return reply.status(200).send(FILES);
  });

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

void bootstrap();

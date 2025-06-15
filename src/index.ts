import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import axios from "axios";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { Readable } from "node:stream";
import router from "./router";

const app = new Hono()
  .use("/assets/*", serveStatic({ root: "./" }))
  .get("/stream", async (c) => {
    const range = c.req.header("range") || "";
    const id = c.req.query("id");
    const host = c.req.query("host");

    if (!id || !host) {
      return c.notFound();
    }

    const controller = new AbortController();

    const request = await axios
      .get(`https://files.video-src.com/${encodeURIComponent(id)}`, {
        headers: {
          Range: range,
          Referer: host,
        },
        responseType: "stream",
        signal: controller.signal,
      })
      .then((response) => response)
      .catch(() => null);

    if (!request) return c.notFound();

    const source = request.data as Readable;

    if (request.headers["content-type"]) {
      c.header("Content-Type", request.headers["content-type"] as string);
    }
    if (request.headers["content-length"]) {
      c.header("Content-Length", request.headers["content-length"] as string);
    }
    if (request.headers["content-range"]) {
      c.header("Content-Range", request.headers["content-range"] as string);
    }
    if (request.status === 206) {
      c.header("Accept-Ranges", "bytes");

      c.status(206);
    }

    return stream(c, async (stream) => {
      stream.onAbort(() => {
        controller.abort();
      });

      await stream.pipe(Readable.toWeb(source));
    });
  })
  .route("/", router)
  .onError(async (error, c) => {
    console.error(error);
    return c.json({ message: "Unexpected internal server error" }, 500);
  });

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, () => {
  console.log("App running");
});

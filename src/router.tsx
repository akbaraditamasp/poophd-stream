import { Hono } from "hono";
import App from "./pages";
import web from "./web";
import { getFolder, getVideo } from "./utils/video";

const router = new Hono().use(web).get("/", async (c) => {
  const link = await c.req.query("link");

  let detail: Awaited<ReturnType<typeof getVideo>>[] | undefined;

  if (link) {
    const url = new URL(link || "");

    if (url.pathname.match(/^\/f/)) {
      detail = await getFolder(link).catch(() => []);
    } else {
      detail = await getVideo(link)
        .then((res) => [res])
        .catch(() => []);
    }
  }

  return c.render(
    <App detail={detail} isError={Boolean(link && !detail)} url={link} />
  );
});

export default router;

import { Hono } from "hono";
import App from "./pages";
import web from "./web";
import { getVideo } from "./utils/video";

const router = new Hono().use(web).get("/", async (c) => {
  const link = await c.req.query("link");

  const detail = link ? await getVideo(link).catch(() => undefined) : undefined;

  return c.render(
    <App detail={detail || {}} isError={Boolean(link && !detail)} url={link} />
  );
});

export default router;

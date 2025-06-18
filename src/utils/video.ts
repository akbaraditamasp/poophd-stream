import axios from "axios";
import { load } from "cheerio";

export async function getVideo(link: string) {
  const url = new URL(link);

  const { videoID, imageURL } = await axios
    .get("https://poophd.video-src.com/vplayer", {
      params: {
        id: url.pathname.split("/").pop(),
      },
      headers: {
        Referer: `https://${url.hostname}`,
      },
      responseType: "text",
    })
    .then(({ data }) => {
      const urls = (data as string).match(
        /\"https:\/\/files\.video-src\.com\/([^"]+)\"/g
      );

      const thumbnailId = urls
        ?.find((el) => el.match(/(.jpg|.jpeg|.png)\"/i))
        ?.match(/\"https:\/\/files\.video-src\.com\/(.*)\"/);
      const videoID = urls
        ?.pop()
        ?.match(/\"https:\/\/files\.video-src\.com\/(.*)\"/);

      if (!thumbnailId || !videoID) {
        throw new Error("Not Found");
      }

      return {
        imageURL: `https://files.video-src.com/${encodeURIComponent(
          thumbnailId![1]!
        )}`,
        videoID: videoID![1]!,
      };
    });

  const { title, duration } = await axios
    .get(link, { responseType: "text" })
    .then(({ data }) => {
      const $ = load(data);

      return {
        title: $("title").text().trim(),
        duration: $(".length").text().trim(),
      };
    });

  return {
    title,
    duration,
    imageURL,
    videoID,
    host: `https://poophd.video-src.com/`,
  };
}

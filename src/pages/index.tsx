import pkg from "../../package.json";
import type { getVideo } from "../utils/video";

export default function App({
  detail,
  url,
  isError,
}: {
  detail?: Partial<Awaited<ReturnType<typeof getVideo>>>[];
  url?: string;
  isError?: boolean;
}) {
  return (
    <div class="w-full min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-5">
      <div class="bg-white w-full lg:w-[480px] p-8 rounded shadow mb-8">
        <div class="flex justify-between items-center">
          <h1 class="font-bold font-montserrat">PoopHD Stream</h1>
          <h2 class="text-sm text-gray-500">v{pkg.version}</h2>
        </div>
        <div class="mt-5">
          Streaming video apapun dari server PoopHD tanpa iklan dan full gratis
        </div>
        <form action="" method="get">
          <input
            type="url"
            class="h-10 w-full bg-white rounded border border-gray-200 mt-10 p-2"
            placeholder="URL / Link"
            name="link"
            value={url}
          />
          <button
            type="submit"
            class="h-10 w-full bg-neutral-700 text-white rounded mt-5"
          >
            TONTON
          </button>
        </form>
        {isError && (
          <div class="mt-5 pt-5 border-t border-gray-200 text-red-500 text-center">
            Video gagal dimuat
          </div>
        )}
        {detail?.map((vid) => (
          <div class="mt-5 pt-5 border-t border-gray-200">
            <div class="relative w-full pt-[56%] bg-black rounded overflow-hidden">
              <img
                src={vid.imageURL}
                class="w-full h-full absolute top-0 left-0 object-contain"
              />
              <div class="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/60">
                <button
                  type="button"
                  data-video={encodeURIComponent(vid.videoID || "")}
                  class="bg-white py-2 px-3 text-xs rounded-full opacity-70 hover:opacity-100"
                  onclick="play(this)"
                >
                  PUTAR
                </button>
              </div>
              <div class="video w-full h-full absolute top-0 left-0 bg-black hidden"></div>
            </div>
            <div class="p-2">
              <h2 class="font-bold">{vid.title}</h2>
              <p class="text-sm">Durasi: {vid.duration || "0:0"}</p>
            </div>
          </div>
        ))}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function play(btn) {
                const wrapper = btn.closest('.relative');
                const videoContainer = wrapper.querySelector('.video');
                const videoId = btn.getAttribute('data-video');

                videoContainer.innerHTML = \`<video style="width: 100%; height: 100%;" controls>
                        <source src="/stream?id=\${videoId}&host=https://poophd.video-src.com/" type="video/mp4">
                        Browser Anda tidak mendukung video tag.
                    </video>\`;
                videoContainer.classList.remove("hidden");
            }
        `,
        }}
      ></script>
    </div>
  );
}

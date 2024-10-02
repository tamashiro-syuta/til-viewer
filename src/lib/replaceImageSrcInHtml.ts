import cheerio from "cheerio";
import { getImageAsBase64 } from "./s3";

// ローカルパスの画像をS3から取得した画像に置き換える
async function replaceImageSrcInHtml(htmlContent: string) {
  try {
    const $ = await cheerio.load(htmlContent);

    await Promise.all(
      $("img").map(async (_i, elm) => {
        const src = $(elm).attr("src");

        if (!src) return $(elm);

        try {
          const base64 = await getImageAsBase64(removeImagePath(src));
          return $(elm).attr("src", base64);
        } catch (error) {
          console.error("error", error);
          return $(elm);
        }
      })
    );

    return $.html();
  } catch (error) {
    throw new Error("画像の置換に失敗しました。");
  }
}

const removeImagePath = (path: string): string => {
  const prefix = "/image/";

  // NOTE: パスが /image で始まるか確認し、取り除く
  if (path.startsWith(prefix)) {
    return path.slice(prefix.length);
  }

  return path;
};

export default replaceImageSrcInHtml;

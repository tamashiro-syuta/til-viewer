"use server";

const apiToken = process.env.GITHUB_API_ACCESS_TOKEN;
const BASE_URL = "https://api.github.com/repos/tamashiro-syuta/TIL/contents/";
const excludeNames = ["README.md", "image"];

export async function fetchGenres() {
  const res = await fetch(BASE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).then((res) => {
    return res.json();
  });

  const genres = res
    .filter((item: any) => !excludeNames.includes(item.name))
    .map((item: any) => item.name) as string[];

  return genres;
}

interface fetchSingleArticleProps {
  paths: string[];
}

type fetchSingleArticleResponse = {
  content: string;
  status: 200 | 404; // NOTE: 一旦、200か404のみを想定
};

// NOTE: 引数のパスから、記事の内容を取得し、markdown形式で返す
export async function fetchSingleArticle({
  paths,
}: fetchSingleArticleProps): Promise<fetchSingleArticleResponse> {
  const url = `${BASE_URL}${paths.join("/")}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).then((res) => {
    return res.json();
  });

  // NOTE: 記事が見つからない場合は、404を返す
  if (res.status === "404") {
    return {
      content: "",
      status: 404,
    };
  }

  const decodedContent = Buffer.from(res.content, "base64").toString();
  return {
    content: decodedContent,
    status: 200,
  };
}

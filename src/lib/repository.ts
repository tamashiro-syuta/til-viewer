import matter from "gray-matter";

const apiToken = process.env.GITHUB_API_ACCESS_TOKEN;
const BASE_URL = "https://api.github.com/repos/tamashiro-syuta/TIL";
const excludeNames = ["README.md", "image"];

export async function fetchTopGenres() {
  const url = `${BASE_URL}/contents/`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: false },
  }).then((res) => {
    return res.json();
  });

  const genres = res
    .filter((item: any) => !excludeNames.includes(item.name))
    .map((item: any) => item.name) as string[];

  return genres;
}

export async function fetchAllArticles() {
  const sha1 = await fetchTreeSha1();
  const url = `${BASE_URL}/git/trees/${sha1}?recursive=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: false },
  }).then((res) => {
    return res.json();
  });

  const articles = res.tree
    .filter((item: any) => item.path.endsWith(".md") && item.type === "blob")
    .filter((item: any) => !excludeNames.includes(item.path))
    .map((item: any) => item.path) as string[];

  return articles;
}

interface FetchAllArticlesWithFrontMatterReturn {
  path: string;
  frontMatter: FrontMatter | null;
}

// NOTE: パス、フロントマターのみを返す
export async function fetchAllArticlesWithFrontMatter() {
  const sha1 = await fetchTreeSha1();
  const url = `${BASE_URL}/git/trees/${sha1}?recursive=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: false },
  }).then((res) => {
    return res.json();
  });

  const paths = res.tree
    .filter((item: any) => item.path.endsWith(".md") && item.type === "blob")
    .filter((item: any) => !excludeNames.includes(item.path))
    .map((item: any) => item.path) as string[];

  const PathAndFrontMatters = await Promise.all(
    paths.map(async (path) => {
      const frontMatter = await fetchSingleArticleFrontMatter({
        paths: path.split("/"),
      });

      return {
        path,
        frontMatter,
      };
    })
  );

  return PathAndFrontMatters;
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
  const url = `${BASE_URL}/contents/${paths.join("/")}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: false },
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

interface FrontMatter {
  title: string;
  tags: string[];
}

export async function fetchSingleArticleFrontMatter({
  paths,
}: fetchSingleArticleProps): Promise<FrontMatter | null> {
  const { content, status } = await fetchSingleArticle({ paths });

  if (status === 404) {
    return null;
  }

  const matteredContent = matter(content, {});
  const title: string = matteredContent?.data?.title || "";
  const tags: string[] = matteredContent?.data?.tags || [];

  return {
    title,
    tags,
  } as FrontMatter;
}

// NOTE: private関数
async function fetchTreeSha1() {
  const url = `${BASE_URL}/branches/main`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: false },
  }).then((res) => {
    return res.json();
  });

  return res.commit.sha;
}

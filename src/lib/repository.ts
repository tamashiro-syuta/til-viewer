import matter from "gray-matter";
import { Octokit } from "@octokit/rest";

const apiToken = process.env.GITHUB_API_ACCESS_TOKEN;
const BASE_URL = "https://api.github.com/repos/tamashiro-syuta/TIL";
const excludeNames = ["README.md", "image", "create_md.sh"];

const octokit = new Octokit({
  auth: apiToken,
});

export async function fetchTopGenres() {
  try {
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
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export async function fetchAllArticles() {
  try {
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
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export interface ArticlePathWithFrontMatter extends Partial<FrontMatter> {
  path: string;
}

// NOTE: パス、フロントマターのみを返す
export async function fetchAllArticlesWithFrontMatter(): Promise<
  ArticlePathWithFrontMatter[]
> {
  try {
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
          ...frontMatter,
        };
      })
    );

    return PathAndFrontMatters;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
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
  try {
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
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

interface FrontMatter {
  title: string;
  tags: string[];
}

export async function fetchSingleArticleFrontMatter({
  paths,
}: fetchSingleArticleProps): Promise<FrontMatter | null> {
  try {
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
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export async function fetchLastHalfYearsCommitCountByDate() {
  // 2ヶ月前の1日から、今日までの正確な日数を取得
  const today: Date = new Date();
  const OneYearAgoDate: Date = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    today.getDate()
  );

  try {
    let page = 1;
    let hasMore = true;
    const per_page = 100;
    const commitsCountByDate: { [key: string]: number } = {};

    while (hasMore) {
      const { data } = await octokit.repos.listCommits({
        owner: "tamashiro-syuta",
        repo: "TIL",
        per_page, // NOTE: 1ページあたり100件取得
        page, // NOTE: ページ番号を指定
        since: OneYearAgoDate.toISOString(),
      });

      // データを全体の配列に追加
      data.map((commit) => {
        if (!commit.commit.author?.date) return;

        const date = new Date(commit.commit.author.date).toLocaleDateString();
        commitsCountByDate[date] = commitsCountByDate[date]
          ? commitsCountByDate[date] + 1
          : 1;
      });

      // NOTE: 次のページが存在すれば、ページ数をインクリメント、存在しなければ終了
      data.length < per_page ? (hasMore = false) : page++;
    }

    return commitsCountByDate;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

// NOTE: private関数
async function fetchTreeSha1() {
  try {
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
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

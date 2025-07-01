"use server";

import fs from "fs";
import matter from "gray-matter";
import path from "path";

const TARGET_PATH = "TIL";
const excludeNames = ["README.md", "image", "create_md.sh"];

export async function fetchAllArticles() {
  try {
    // TILディレクトリのパスを取得
    const tilDirPath = path.join(process.cwd(), TARGET_PATH);

    // ディレクトリが存在するか確認
    if (!fs.existsSync(tilDirPath)) {
      console.error("TILディレクトリが存在しません");
      return [];
    }

    // 再帰的にすべてのMarkdownファイルを取得する関数
    const getAllMarkdownFiles = (
      dirPath: string,
      basePath: string = ""
    ): string[] => {
      let results: string[] = [];
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const relativePath = basePath ? path.join(basePath, item) : item;

        // 除外するファイル・ディレクトリをスキップ
        if (excludeNames.includes(item)) continue;

        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          // ディレクトリの場合は再帰的に検索
          results = results.concat(getAllMarkdownFiles(itemPath, relativePath));
        } else if (item.endsWith(".md")) {
          // Markdownファイルの場合は結果に追加
          results.push(relativePath);
        }
      }

      return results;
    };

    // すべてのMarkdownファイルのパスを取得
    const articles = getAllMarkdownFiles(tilDirPath);

    return articles;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export interface ArticlePathAndDateWithFrontMatter
  extends Partial<FrontMatter> {
  path: string;
}

export async function getAllArticlesSortByCommittedAt(): Promise<
  ArticlePathAndDateWithFrontMatter[] | undefined
> {
  try {
    const tilDirPath = path.join(process.cwd(), TARGET_PATH);
    if (!fs.existsSync(tilDirPath)) {
      throw new Error("not found TIL directory");
    }

    // 再帰的にすべてのMarkdownファイルを取得する関数
    const getAllMarkdownFiles = (
      dirPath: string,
      basePath: string = ""
    ): string[] => {
      let results: string[] = [];
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const relativePath = basePath ? path.join(basePath, item) : item;

        // 除外するファイル・ディレクトリをスキップ
        if (excludeNames.includes(item)) continue;

        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          // ディレクトリの場合は再帰的に検索
          results = results.concat(getAllMarkdownFiles(itemPath, relativePath));
        } else if (item.endsWith(".md")) {
          // Markdownファイルの場合は結果に追加
          results.push(relativePath);
        }
      }

      return results;
    };

    const markdownFiles = getAllMarkdownFiles(tilDirPath);
    if (!markdownFiles.length) return [];

    return await Promise.all(
      markdownFiles.map(async (relativePath) => {
        const filePath = path.join(TARGET_PATH, relativePath);
        const frontMatter = await fetchSingleArticleFrontMatter({
          paths: relativePath.split("/"),
        });

        return {
          path: filePath,
          ...frontMatter,
        };
      })
    );
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

interface fetchSingleArticleProps {
  paths: string[];
}

type fetchSingleArticleResponse = {
  title: string;
  tags: string[];
  content: string;
  status: 200 | 404; // NOTE: 一旦、200か404のみを想定
};

// NOTE: 引数のパスから、ローカルの記事の内容を取得し、markdown形式で返す
export async function fetchSingleArticleFromLocal({
  paths,
}: fetchSingleArticleProps): Promise<fetchSingleArticleResponse> {
  const excludeFileHeads = [".well-known"];
  if (paths.length > 0 && excludeFileHeads.includes(paths[0])) {
    return {
      title: "",
      tags: [],
      content: "",
      status: 404,
    };
  }

  try {
    // TILディレクトリからのパスを作成
    const filePath = path.join(process.cwd(), TARGET_PATH, ...paths);

    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      return {
        title: "",
        tags: [],
        content: "",
        status: 404,
      };
    }

    // ファイルの内容を読み込む
    const content = fs.readFileSync(filePath, "utf8");
    const matteredContent = matter(content);
    const title: string = matteredContent.data.title || "";
    const tags: string[] = matteredContent.data.tags || [];

    return {
      title,
      tags,
      content: matteredContent.content,
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
    const { title, tags, status } = await fetchSingleArticleFromLocal({
      paths,
    });
    if (status === 404) return null;

    return {
      title,
      tags,
    };
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

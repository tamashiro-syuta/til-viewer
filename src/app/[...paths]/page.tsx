import markdownToHtml from "zenn-markdown-html";
import "zenn-content-css";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { fetchAllArticles, fetchSingleArticle } from "@/lib/repository";
import Chip from "@/components/chip";

export const generateStaticParams = async () => {
  const articles = await fetchAllArticles();
  const arrays = articles.map((article) => article.split("/"));

  return arrays.map((paths) => ({
    paths,
  }));
};

export default async function Page({
  params,
}: {
  params: { paths: string[] };
}) {
  const { content, status } = await fetchSingleArticle({ paths: params.paths });

  // NOTE: 記事が見当たらない場合は、404ページを表示
  if (status === 404) notFound();

  // NOTE: matteredContent.data → { title: '初めてのGo言語 ~ Chapter1 ~', tags: [ 'Go' ] }
  const matteredContent = matter(content, {});
  const title: string = matteredContent?.data?.title || "";
  const tags: string[] = matteredContent?.data?.tags || [];

  const html = markdownToHtml(matteredContent.content, {
    embedOrigin: "https://embed.zenn.studio",
  });

  return (
    <div className="pt-4">
      <div className="md:mb-12 text-center md:py-12 py-2 pt-5 bg-primary/20 px-0border border-gray-200 rounded-md">
        {title && <h1 className="text-2xl font-bold md:pb-6 pb-4">{title}</h1>}

        {tags && tags.map((tag) => <Chip key={tag} label={tag} />)}
      </div>

      <div
        className="znc md:border md:border-gray-200 md:rounded-md md:p-6 pt-6"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
}

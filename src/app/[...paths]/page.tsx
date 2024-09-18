import markdownToHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import { fetchAllArticles, fetchSingleArticle } from "@/lib/repository";

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

  const html = markdownToHtml(content, {
    embedOrigin: "https://embed.zenn.studio",
  });

  return (
    <Container>
      <div
        className="znc"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </Container>
  );
}

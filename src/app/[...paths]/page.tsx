import markdownToHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Box, Container, Typography } from "@mui/material";
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
    <Container>
      <Box sx={{ marginY: "12px" }}>
        {title && (
          <Typography
            variant="h3"
            sx={{
              marginTop: "20px",
              marginBottom: "10px",
              fontSize: { xs: "25px", sm: "30px", md: "35px", lg: "40px" },
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
        )}

        {tags && tags.map((tag) => <Chip key={tag} label={tag} />)}
      </Box>

      <div
        className="znc"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </Container>
  );
}

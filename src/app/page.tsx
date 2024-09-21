import ArticlesTable from "@/components/articlesTable";
import { fetchAllArticlesWithFrontMatter } from "@/lib/repository";

export default async function Home() {
  const articlesWithFrontMatter = await fetchAllArticlesWithFrontMatter();

  console.log(articlesWithFrontMatter);

  return <ArticlesTable />;
}

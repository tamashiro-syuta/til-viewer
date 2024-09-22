import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchAllArticlesWithFrontMatter } from "@/lib/repository";
import Table from "./table";

export default async function ArticlesTable() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["articles"],
    queryFn: fetchAllArticlesWithFrontMatter,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Table />
    </HydrationBoundary>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllArticlesSortByCommittedAt } from "@/lib/repository";
import Table from "./table";

export default async function ArticlesTable() {
  const articles = await getAllArticlesSortByCommittedAt();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["articles"],
    queryFn: getAllArticlesSortByCommittedAt,
    initialData: articles,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Table />
    </HydrationBoundary>
  );
}

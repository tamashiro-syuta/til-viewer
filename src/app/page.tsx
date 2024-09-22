// import ArticlesTable from "@/components/articlesTable";
// import { fetchAllArticlesWithFrontMatter } from "@/lib/repository";

import ArticlesTable from "@/components/articlesTable";
import CalendarHeatmap from "@/components/calendar-heatmap";
import { fetchCommitCountByDate } from "@/lib/repository";

export default async function Home() {
  const commitsCountByDate = await fetchCommitCountByDate();
  const commitsCountAndDate = Object.keys(commitsCountByDate).map((date) => {
    return {
      date: new Date(date),
      count: commitsCountByDate[date],
    };
  });

  return (
    <>
      <CalendarHeatmap commitsCountAndDate={commitsCountAndDate} />
      <ArticlesTable />
    </>
  );
}

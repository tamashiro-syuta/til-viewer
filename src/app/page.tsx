import ArticlesTable from "@/components/articlesTable";
import CalendarHeatmap from "@/components/calendar-heatmap";
import { fetchLastHalfYearsCommitCountByDate } from "@/lib/repository";

export default async function Home() {
  const commitsCountByDate = await fetchLastHalfYearsCommitCountByDate();
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

import { getDailyCountsForLastHalfYear } from "@/actions/file-commits";
import ArticlesTable from "@/components/articlesTable";
import CalendarHeatmap from "@/components/calendar-heatmap";

export default async function Home() {
  const commitsCountAndDate = await getDailyCountsForLastHalfYear();

  return (
    <>
      <CalendarHeatmap commitsCountAndDate={commitsCountAndDate} />
      <ArticlesTable />
    </>
  );
}

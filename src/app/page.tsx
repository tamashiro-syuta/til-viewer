import ArticlesTable from "@/components/articlesTable";
import CalendarHeatmap from "@/components/calendar-heatmap";
import { getDailyCountsForLastHalfYear } from "@/usecases/file-commits";

export default async function Home() {
  const commitsCountAndDate = await getDailyCountsForLastHalfYear();

  return (
    <>
      <CalendarHeatmap commitsCountAndDate={commitsCountAndDate} />
      <ArticlesTable />
    </>
  );
}

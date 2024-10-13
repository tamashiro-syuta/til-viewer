import ArticlesTable from "@/components/articlesTable";
import CalendarHeatmap from "@/components/calendar-heatmap";
import {
  getDailyCountsForLastHalfYear,
  getPathAndCountListGroupByDateForLastHalfYear,
} from "@/usecases/file-commits";

export default async function Home() {
  const commitsCountAndDate = await getDailyCountsForLastHalfYear();
  const pathAndCountListGroupByDate =
    await getPathAndCountListGroupByDateForLastHalfYear();

  return (
    <>
      <CalendarHeatmap
        commitsCountAndDate={commitsCountAndDate}
        pathAndCountListGroupByDate={pathAndCountListGroupByDate}
      />
      <ArticlesTable />
    </>
  );
}

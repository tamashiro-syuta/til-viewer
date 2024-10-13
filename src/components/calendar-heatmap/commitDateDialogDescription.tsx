import { getPathAndCountByDate } from "@/actions/file-commits";
import Link from "next/link";

interface Props {
  date: Date;
}

const commitDateDialogDescription = async ({ date }: Props) => {
  const fileCommitCountMap = await getPathAndCountByDate(date);

  if (!fileCommitCountMap) {
    return <div>🙇‍♂️ コミット履歴の取得に失敗しました</div>;
  }

  return (
    <div className="commit-data-table pt-3">
      {fileCommitCountMap.map(({ path, commitCount }) => (
        <Link key={path} href={`/${path}`}>
          <div className="mb-2 pl-3 p-2 rounded-md border border-2 border-primary">
            <p className="md:text-md text-sm text-left">{path}</p>
            <p className="md:text-md text-sm text-left pl-6">
              👉 {commitCount}コミット
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default commitDateDialogDescription;

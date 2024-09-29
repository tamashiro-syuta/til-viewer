import { getCommitsByDate } from "@/lib/repository";
import Link from "next/link";

interface Props {
  date: Date;
}

const commitDateDialogDescription = async ({ date }: Props) => {
  // 1秒待機
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const fileCommitCountMap = await getCommitsByDate({ date });

  if (!fileCommitCountMap) {
    return <div>🙇‍♂️ コミット履歴の取得に失敗しました</div>;
  }

  return (
    <div className="commit-data-table pt-3">
      {Object.entries(fileCommitCountMap).map(([fileName, commitCount]) => (
        <Link key={fileName} href={`/${fileName}`}>
          <div className="mb-2 pl-3 p-2 rounded-md border border-2 border-primary">
            <p className="md:text-md text-sm text-left">{fileName}</p>
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

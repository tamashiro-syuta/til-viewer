"use server";

import { NewFileCommitsRepository } from "@/infra/dynamodb/file-commits";

type PathAndCount = {
  path: string;
  commitCount: number;
};
type FileCommitCountMap = PathAndCount[];
export type FileCommits = Record<string, number>;

const fileCommitsRepository = new NewFileCommitsRepository();

export async function getPathAndCountByDate(
  date: Date
): Promise<FileCommitCountMap> {
  try {
    const fileCommits = await fileCommitsRepository.GetCommitByDate(date);
    if (!fileCommits) return [];

    const pathAndCountArray: PathAndCount[] = fileCommits?.map(
      ({ path, commitCount }) => {
        const pathAndCount: PathAndCount = {
          path,
          commitCount,
        };

        return pathAndCount;
      }
    );

    return pathAndCountArray;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export async function getDailyCountsForLastHalfYear(): Promise<FileCommits> {
  try {
    const today: Date = new Date();
    const OneYearAgoDate: Date = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    );
    const betweenDateList = await fileCommitsRepository.GetListBetweenDate(
      OneYearAgoDate,
      today
    );

    if (!betweenDateList) return {};

    const fairyCommits: FileCommits = {};
    betweenDateList.forEach((fileCommit) => {
      const date = fileCommit.date;
      fairyCommits[date] = fairyCommits[date]
        ? fairyCommits[date] + fileCommit.commitCount
        : fileCommit.commitCount;
    });
    return fairyCommits;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

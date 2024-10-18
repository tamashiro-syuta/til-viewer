import { CreateFileCommitInputSchema } from "@/entity/file-commits.type";
import { NewFileCommitsRepository } from "@/infra/dynamodb/file-commits";

export type PathAndCount = {
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

// NOTE: 日付ごとにどのファイルに何回コミットされたかを返す
export async function getPathAndCountListGroupByDateForLastHalfYear(): Promise<
  Record<string, PathAndCount[]>
> {
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

    const pathAndCountListGroupByDate = betweenDateList.reduce(
      (acc, { date, path, commitCount }) => {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({ path, commitCount });
        return acc;
      },
      {} as Record<string, PathAndCount[]>
    );

    return pathAndCountListGroupByDate;
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

export async function createPathAndCount(input: CreateFileCommitInputSchema) {
  try {
    const hoge = await fileCommitsRepository.Create(input);
    console.log("fileCommitsRepository.Create(input);", hoge);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

export async function bulkCreatePathAndCount(
  inputs: CreateFileCommitInputSchema[]
) {
  try {
    const hoge = await fileCommitsRepository.BulkCreate(inputs);
    console.log("fileCommitsRepository.BulkCreate(inputs);", hoge);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
}

import { FileCommitsSchema } from "@/entity/file-commits.type";

// NOTE: 実装はinfra層で行う
export interface FileCommitsRepository {
  GetCommitByDate(date: Date): Promise<FileCommitsSchema[] | undefined>;
  GetListBetweenDate(
    start: Date,
    end: Date
  ): Promise<FileCommitsSchema[] | undefined>;
}
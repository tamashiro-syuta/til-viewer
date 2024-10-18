export type FileCommitsSchema = {
  date: string;
  path: string;
  commitCount: number;
};

export type CreateFileCommitInputSchema = {
  date: Date;
  path: string;
  commitCount: number;
};

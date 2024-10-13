"use client";

import { Dispatch, SetStateAction, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { dateToYYYYMMDD } from "@/lib/utils";
import { SpinLoading } from "../loading";
import { PathAndCount } from "@/usecases/file-commits";
import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date: Date | null;
  fileCommitCounts: PathAndCount[];
  isNotCommit: (date: Date | null) => boolean;
}

const CommitDateDialog = ({
  open,
  setOpen,
  date,
  fileCommitCounts,
  isNotCommit,
}: Props) => {
  if (date === null) return;

  const isCommitNone = isNotCommit(date);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isCommitNone ? (
        <NoCommit date={date} />
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`📍${dateToYYYYMMDD(date)} のコミット`}</DialogTitle>
          </DialogHeader>
          <Suspense
            fallback={<SpinLoading size={"medium"} className="pt-20 pb-16" />}
          >
            <div className="commit-data-table pt-3">
              {fileCommitCounts.map(({ path, commitCount }) => (
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
          </Suspense>
        </DialogContent>
      )}
    </Dialog>
  );
};

const NoCommit = ({ date }: { date: Date | null }) => {
  const TITLE = date
    ? `❌ ${dateToYYYYMMDD(date)}のコミットはありません`
    : "❌ この日のコミットはありません";

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{TITLE}</DialogTitle>
        <DialogDescription className="px-3 pt-3 pb-0">
          毎日、草生やせるように頑張ろうね！
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default CommitDateDialog;

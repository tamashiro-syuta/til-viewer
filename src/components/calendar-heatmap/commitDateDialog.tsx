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
  const futureDates = getDatesUntilEndOfNextMonth();
  const isFuture = isDateInArray(futureDates, date);

  if (isFuture) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <IsFutureDate date={date} />
      </Dialog>
    );
  }

  if (isCommitNone) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <NoCommit date={date} />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          この日のコミットはないみたい！そんな日もあるよね！！（圧）
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

const IsFutureDate = ({ date }: { date: Date | null }) => {
  if (date === null) return false;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>⭐️ 未来の日付なんだぜ！!</DialogTitle>
        <DialogDescription className="px-3 pt-3 pb-0">
          毎日、草生やせるように頑張ろうぜ！
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

function getDatesUntilEndOfNextMonth(): Date[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const endOfNextMonth = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth() + 2,
    0
  );

  const dates: Date[] = [];
  let currentDate = tomorrow;

  while (currentDate <= endOfNextMonth) {
    dates.push(new Date(currentDate)); // YYYY-MM-DD形式で追加
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function isDateInArray(dates: Date[], targetDate: Date): boolean {
  return dates.some(
    (date) =>
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getDate() === targetDate.getDate()
  );
}

export default CommitDateDialog;

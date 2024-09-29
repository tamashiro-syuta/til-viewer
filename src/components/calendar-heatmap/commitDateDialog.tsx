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
import CommitDateDialogDescription from "./commitDateDialogDescription";
import { SpinLoading } from "../loading";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date: Date | null;
  isNotCommit: (date: Date | null) => boolean;
}

const CommitDateDialog = ({ open, setOpen, date, isNotCommit }: Props) => {
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
            <DialogDescription>
              <Suspense
                fallback={
                  <SpinLoading size={"medium"} className="pt-20 pb-16" />
                }
              >
                <CommitDateDialogDescription date={date} />
              </Suspense>
            </DialogDescription>
          </DialogHeader>
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

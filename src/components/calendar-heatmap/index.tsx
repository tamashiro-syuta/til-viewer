"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { CustomRow } from "./row";
import { ja } from "date-fns/locale";
import "./styles.css";
import { useState } from "react";
import CommitDateDialog from "./commitDateDialog";

interface CommitCountAndDate {
  date: Date;
  count: number;
}
export interface Props {
  commitsCountAndDate: CommitCountAndDate[];
}

const CalendarHeatmap = ({ commitsCountAndDate }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setIsDialogOpen(true); // 日付が選択されたらダイアログを開く
    }
  };

  // NOTE: コミット数に応じてランク付け
  const [NONE, LOW, MIDDLE, HIGH] = [0, 1, 3, 5];
  const isCommitNone = (count: number) => count === NONE;
  const isCommitLow = (count: number) => !isCommitNone(count) && count <= LOW;
  const isCommitMiddle = (count: number) =>
    !isCommitLow(count) && count <= MIDDLE;
  const isCommitHigh = (count: number) =>
    !isCommitMiddle(count) && count <= HIGH;
  const isCommitExtreme = (count: number) => count > HIGH;

  const getDatesByCommitLank = (
    checkCommitLank: (count: number) => boolean
  ): Date[] => {
    return commitsCountAndDate
      .filter((commit) => checkCommitLank(commit.count))
      .map((commit) => commit.date);
  };

  const modifiers = {
    none: getDatesByCommitLank(isCommitNone),
    low: getDatesByCommitLank(isCommitLow),
    middle: getDatesByCommitLank(isCommitMiddle),
    high: getDatesByCommitLank(isCommitHigh),
    extreme: getDatesByCommitLank(isCommitExtreme),
  };

  const commonStyle = "text-white hover:text-white";
  const committedCommonStyle = "transition hover:duration-300 hover:scale-110";
  const modifiersClassNames = {
    none: cn(commonStyle, "bg-green-50 hover:bg-green-50"),
    low: cn(
      commonStyle,
      committedCommonStyle,
      "bg-green-300 hover:bg-green-300"
    ),
    middle: cn(
      commonStyle,
      committedCommonStyle,
      "bg-green-500 hover:bg-green-500"
    ),
    high: cn(
      commonStyle,
      committedCommonStyle,
      "bg-green-700 hover:bg-green-700"
    ),
    extreme: cn(
      commonStyle,
      committedCommonStyle,
      "bg-green-900 hover:bg-green-900"
    ),
  };

  const visibleMonths = 6;
  const today = new Date();
  const monthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - visibleMonths,
    1
  );

  const isNotCommit = (date: Date | null): boolean => {
    if (!date) return true;

    const foundObject = commitsCountAndDate.find((item) => {
      return item.date.toDateString() === date.toDateString();
    });

    if (!foundObject || foundObject.count === NONE) return true;
    return false;
  };

  return (
    <>
      <div className="flex justify-center overflow-x-auto">
        <Calendar
          // NOTE: なんか1足したら見た目いい感じなったから足してるよ
          numberOfMonths={visibleMonths + 1}
          defaultMonth={monthsAgo}
          locale={ja}
          formatters={{
            formatCaption: (d) => {
              const date = new Date(d);
              return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
            },
          }}
          classNames={{
            nav: "hidden",
            month: "!ml-0 space-y-4",
            tbody: "flex",
            row: "[user-select:none;] flex flex-col",
            root: "root", // NOTE: ライブラリでスタイルが変更できない箇所をCSSで上書き
            cell: cn(
              "relative p-px text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-gray-200 [&:has([aria-selected].day-outside)]:bg-gray-200 rounded-sm"
            ),
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-8 p-px font-normal text-gray-300 cursor-pointer aria-selected:opacity-100 hover:text-gray-400 hover:bg-gray-200 bg-accent rounded-sm"
            ),
            day_outside: "",
          }}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          components={{
            Head: () => <></>,
            Row: (props) => <CustomRow {...props} />,
            Caption: () => <></>,
          }}
          onDayClick={(date) => handleDateChange(date)}
        />
      </div>
      <CommitDateDialog
        date={selectedDate}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        isNotCommit={isNotCommit}
      />
    </>
  );
};

export default CalendarHeatmap;

"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { CustomRow } from "./row";
import { ja } from "date-fns/locale";
import "./styles.css";

interface CommitCountAndDate {
  date: Date;
  count: number;
}
export interface Props {
  commitsCountAndDate: CommitCountAndDate[];
}

const CalendarHeatmap = async ({ commitsCountAndDate }: Props) => {
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

  const modifiersClassNames = {
    none: "bg-green-50 text-white",
    low: "bg-green-300 text-white",
    middle: "bg-green-500 text-white",
    high: "bg-green-700 text-white",
    extreme: "bg-green-900 text-white",
  };

  const today = new Date();
  const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);

  return (
    <div className="flex justify-center overflow-x-auto">
      <Calendar
        numberOfMonths={3}
        defaultMonth={twoMonthsAgo}
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
      />
    </div>
  );
};

export default CalendarHeatmap;

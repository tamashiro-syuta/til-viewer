"use client";

import { Day, WeekNumber, useDayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { getUnixTime } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
export interface RowProps {
  /** The month where the row is displayed. */
  displayMonth: Date;
  /** The number of the week to render. */
  weekNumber: number;
  /** The days contained in the week. */
  dates: Date[];

  contents?: Array<{
    content: string;
    date: Date;
  }>;
}

const DisplayContent = ({
  date,
  contents,
}: {
  date: Date;
  contents?: Array<{ content: string; date: Date }>;
}) => {
  if (!contents || !contents.length) return <></>;

  const content = contents.filter((content) => {
    if (
      new Date(content.date).toLocaleDateString("ja-JP") ===
      new Date(date).toLocaleDateString("ja-JP")
    ) {
      return content;
    }
  })[0];

  if (!content) return <></>;
  return <span className="font-bold text-gray-800">{content.content}</span>;
};

/** Render a row in the calendar, with the days and the week number. */
export function CustomRow(props: RowProps): JSX.Element {
  const { styles, classNames, showWeekNumber, components } = useDayPicker();

  const DayComponent = components?.Day ?? Day;
  const WeeknumberComponent = components?.WeekNumber ?? WeekNumber;

  let weekNumberCell;
  if (showWeekNumber) {
    weekNumberCell = (
      <td className={classNames.cell} style={styles.cell}>
        <WeeknumberComponent number={props.weekNumber} dates={props.dates} />
      </td>
    );
  }

  /* NOTE
    1行目がキャプションとして表示される月を取得しています(2024年 4月の部分)。
    2行目が最後の週の最後の日の月を取得しています。カレンダーでは週の最後の日が次の月にまたがって書かれている場合があります。
    その場合、1行目と2行目のコードでは結果が違うのでそのときだけ隙間を埋めるようマイナス値のmarginで重ねて表示することで連続した日付を表現しています。
    https://zenn.dev/mitate_gengaku/articles/shadcn-ui-create-heat-map#%E7%B5%90%E6%9E%9C-1
  */
  const thisMonth = new Date(props.displayMonth).getMonth();
  const monthOfData = new Date(props.dates[6]).getMonth();

  return (
    <TooltipProvider>
      <tr
        className={cn(
          classNames.row,
          thisMonth !== monthOfData && "last:-mr-[2rem]"
        )}
        style={styles.row}
      >
        {weekNumberCell}
        {props.dates.map((date) => (
          <Tooltip key={getUnixTime(date)}>
            {date && (
              <td
                className={cn(classNames.cell)}
                style={styles.cell}
                role="presentation"
              >
                <TooltipTrigger>
                  <DayComponent displayMonth={props.displayMonth} date={date} />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="flex flex-col items-start gap-1 rounded-lg border p-2 shadow-sm bg-secondary border-primary border-opacity-10"
                >
                  <span className="text-sm uppercase text-muted-foreground">
                    {new Date(date).toLocaleDateString("ja-JP")}
                  </span>
                  <DisplayContent date={date} contents={props.contents} />
                </TooltipContent>
              </td>
            )}
          </Tooltip>
        ))}
      </tr>
    </TooltipProvider>
  );
}

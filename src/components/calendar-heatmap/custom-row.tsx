import { Day, WeekNumber, useDayPicker } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "@/lib/utils";
import { getUnixTime } from "date-fns";

export interface RowProps {
  displayMonth: Date;
  weekNumber: number;
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
                  className="flex flex-col items-start gap-1 rounded-lg border p-2 shadow-sm"
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

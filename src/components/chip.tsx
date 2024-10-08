import { Badge } from "./ui/badge";

interface Props {
  label: string;
}

const Chip = ({ label }: Props) => {
  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center justify-center px-2 mx-1.5 mb-[3px] h-8 min-w-[48px] text-xs rounded-full cursor-default border border-gray-300 text-center"
    >
      {label}
    </Badge>
  );
};

export default Chip;

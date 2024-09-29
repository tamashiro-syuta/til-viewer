import { cn } from "@/lib/utils";

interface LoadingProps {
  size: "small" | "medium" | "large";
  fullScreen?: boolean;
  className?: string;
}

export const Loading = ({ size, fullScreen, className }: LoadingProps) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <CommonLoading
      size={size}
      fullScreen={fullScreen}
      className={className}
      loadingComponent={
        <div
          className={cn(
            "animate-spin bg-primary rounded-xl",
            sizeClasses[size]
          )}
        />
      }
    />
  );
};

export const SpinLoading = ({ size, fullScreen, className }: LoadingProps) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <CommonLoading
      size={size}
      fullScreen={fullScreen}
      className={className}
      loadingComponent={
        <div
          className={cn(
            "animate-spin border-4 border-primary rounded-full border-t-transparent",
            sizeClasses[size]
          )}
        ></div>
      }
    />
  );
};

interface CommonProps extends LoadingProps {
  loadingComponent: React.ReactElement;
}

const CommonLoading = ({
  size,
  fullScreen,
  className,
  loadingComponent,
}: CommonProps) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center",
        fullScreen && "h-screen",
        className
      )}
      aria-label="読み込み中"
    >
      {loadingComponent}
    </div>
  );
};

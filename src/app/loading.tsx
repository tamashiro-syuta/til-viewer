export default function Loading() {
  return (
    <div
      className="flex justify-center items-center h-screen"
      aria-label="読み込み中"
    >
      <div className="animate-spin h-12 w-12 bg-primary rounded-xl" />
    </div>
  );
}

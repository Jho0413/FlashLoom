import Spinner from "../ui/Spinner";

export default function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-ink-muted">
      <Spinner size={22} />
      <span className="mono-label">loading</span>
    </div>
  );
}

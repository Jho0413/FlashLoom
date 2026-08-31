import Button from "../components/ui/Button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-hairline bg-surface px-[30px] py-11 text-center">
      <div className="relative mb-6 h-[80px] w-[140px]" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 h-[62px] w-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-[7deg] rounded-md border border-dashed border-hairline-strong" />
        <span className="absolute left-1/2 top-1/2 h-[62px] w-[104px] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] rounded-md border border-dashed border-hairline-strong bg-surface" />
      </div>
      <h2 className="text-[18px] font-semibold text-ink">No sets yet</h2>
      <p className="mx-auto mt-2 max-w-[300px] text-pretty text-[14px] text-ink-muted">
        Generate your first flashcard set and it&rsquo;ll show up here for you to study.
      </p>
      <div className="mt-6">
        <Button href="/generate">Generate flashcards</Button>
      </div>
    </div>
  );
}

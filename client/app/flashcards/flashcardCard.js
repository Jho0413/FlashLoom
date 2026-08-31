"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import Dialog from "../components/ui/Dialog";
import Button from "../components/ui/Button";
import Menu from "../components/ui/Menu";
import relativeTime from "../../utils/relativeTime";

export default function FlashcardCard({ id, name, cardCount, timestamp, setLoading, setError }) {
  const { session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const open = () => router.push(`/flashcard?id=${id}&name=${encodeURIComponent(name)}`);

  const mutation = useMutation({
    mutationKey: [session?.user?.id, "flashcards"],
    mutationFn: async () => {
      const token = await session.getToken();
      const response = await fetch("/api/flashcards/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ flashcardId: id }),
      });
      if (!response.ok) throw new Error("Unable to delete flashcard set");
    },
    onSuccess: () => {
      queryClient.setQueryData([session?.user?.id, "flashcards"], (old) =>
        (old || []).filter((set) => set.id !== id)
      );
    },
    onError: () => setError(true),
    onSettled: () => setLoading(false),
  });

  const confirmDelete = () => {
    setConfirming(false);
    setLoading(true);
    mutation.mutate();
  };

  return (
    <>
      <div
        role="link"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === "Enter") open();
        }}
        className="flex h-[152px] cursor-pointer flex-col justify-between rounded-lg border border-hairline bg-surface p-5.5 transition-[border-color,box-shadow] duration-150 hover:border-hairline-strong hover:shadow-tile"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-pretty text-[17px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink">
            {name}
          </h3>
          <Menu
            trigger={
              <button type="button" aria-label="Set options" className="font-mono text-ink-faint hover:text-ink">
                ⋯
              </button>
            }
            items={[
              { label: "Rename", disabled: true },
              { label: "Duplicate", disabled: true },
              {
                label: "Delete",
                danger: true,
                separatorBefore: true,
                onClick: () => setConfirming(true),
              },
            ]}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="mono-meta text-ink-faint">
            {cardCount ?? 0} cards · {relativeTime(timestamp)}
          </span>
          <span className="text-[12.5px] font-medium text-accent">Study &rarr;</span>
        </div>
      </div>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete this set?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete set
            </Button>
          </>
        }
      >
        &ldquo;{name}&rdquo; and its {cardCount ?? 0} cards will be removed. This can&rsquo;t be undone.
      </Dialog>
    </>
  );
}

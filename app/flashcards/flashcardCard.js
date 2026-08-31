"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import Dialog from "../components/ui/Dialog";
import Button from "../components/ui/Button";
import Menu from "../components/ui/Menu";
import relativeTime from "../../utils/relativeTime";

const NAME_LIMIT = 80;

export default function FlashcardCard({ id, name, cardCount, timestamp, setLoading, setError }) {
  const { session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(name);
  const [draftError, setDraftError] = useState(false);

  const key = [session?.user?.id, "flashcards"];
  const open = () => router.push(`/flashcard?id=${id}&name=${encodeURIComponent(name)}`);

  const deleteMutation = useMutation({
    mutationKey: key,
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
      queryClient.setQueryData(key, (old) => (old || []).filter((set) => set.id !== id));
    },
    onError: () => setError(true),
    onSettled: () => setLoading(false),
  });

  const renameMutation = useMutation({
    mutationKey: key,
    mutationFn: async (newName) => {
      const token = await session.getToken();
      const response = await fetch("/api/flashcards/rename", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ flashcardId: id, name: newName }),
      });
      if (!response.ok) throw new Error("Unable to rename flashcard set");
      return newName;
    },
    onSuccess: (newName) => {
      queryClient.setQueryData(key, (old) =>
        (old || []).map((set) => (set.id === id ? { ...set, name: newName } : set))
      );
    },
    onError: () => setError(true),
    onSettled: () => setLoading(false),
  });

  const confirmDelete = () => {
    setConfirming(false);
    setLoading(true);
    deleteMutation.mutate();
  };

  const submitRename = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraftError(true);
      return;
    }
    setRenaming(false);
    setDraftError(false);
    if (trimmed !== name) {
      setLoading(true);
      renameMutation.mutate(trimmed);
    }
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
              {
                label: "Rename",
                onClick: () => {
                  setDraft(name);
                  setDraftError(false);
                  setRenaming(true);
                },
              },
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
        open={renaming}
        onClose={() => setRenaming(false)}
        title="Rename set"
        actions={
          <>
            <Button variant="secondary" onClick={() => setRenaming(false)}>
              Cancel
            </Button>
            <Button onClick={submitRename}>Save</Button>
          </>
        }
      >
        <input
          autoFocus
          value={draft}
          maxLength={NAME_LIMIT}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitRename();
          }}
          className="w-full rounded-md border border-hairline bg-surface-sunken p-3 text-[14px] text-ink placeholder:text-ink-faint focus-visible:border-accent"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={draftError ? "text-[12px] text-danger" : "sr-only"}>
            Enter a name to continue
          </span>
          <span className="mono-meta text-ink-faint">
            {draft.length} / {NAME_LIMIT}
          </span>
        </div>
      </Dialog>

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

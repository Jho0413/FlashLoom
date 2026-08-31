"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import Dialog from "../components/ui/Dialog";
import Button from "../components/ui/Button";

const NAME_LIMIT = 80;

export default function SaveButtonDialog({ flashcards, setError, setLoading, onReset }) {
  const { session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const mutation = useMutation({
    mutationKey: [session?.user?.id, "flashcards"],
    mutationFn: async () => {
      const token = await session.getToken();
      const response = await fetch("/api/flashcards/save", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), flashcards }),
      });
      if (!response.ok) throw new Error("Unable to save flashcards");
      const data = await response.json();
      return data.id;
    },
    onSuccess: (id) => {
      const key = [session?.user?.id, "flashcards"];
      if (queryClient.getQueryData(key)) {
        queryClient.setQueryData(key, (old) => [
          { id, name: name.trim(), cardCount: flashcards.length, timestamp: Date.now() },
          ...(old || []),
        ]);
      }
      setOpen(false);
      setSavedId(id);
    },
    onError: () => {
      setOpen(false);
      setError(true);
    },
    onSettled: () => setLoading(false),
  });

  const save = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setLoading(true);
    mutation.mutate();
  };

  const closeSuccess = () => {
    setSavedId(null);
    setName("");
  };

  if (!flashcards || flashcards.length === 0) return null;

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={Boolean(savedId)}>
        Save set
      </Button>

      {savedId ? (
        <Dialog
          open
          onClose={closeSuccess}
          title="Saved to your library"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  closeSuccess();
                  onReset?.();
                }}
              >
                Generate another
              </Button>
              <Button
                onClick={() =>
                  router.push(`/flashcard?id=${savedId}&name=${encodeURIComponent(name.trim())}`)
                }
              >
                View set
              </Button>
            </>
          }
        >
          <span className="font-mono text-accent">✓</span> {flashcards.length} cards are ready in your
          library.
        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Name this set"
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save set</Button>
            </>
          }
        >
          <input
            autoFocus
            value={name}
            maxLength={NAME_LIMIT}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Cell respiration — Lecture 4"
            className="w-full rounded-md border border-hairline bg-surface-sunken p-3 text-[14px] text-ink placeholder:text-ink-faint focus-visible:border-accent"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className={nameError ? "text-[12px] text-danger" : "sr-only"}>
              Enter a name to continue
            </span>
            <span className="mono-meta text-ink-faint">
              {name.length} / {NAME_LIMIT}
            </span>
          </div>
        </Dialog>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import InputField from "../components/flashcards/inputField";
import DropFileInput from "./dropFileInput";
import ErrorBanner from "../components/ui/ErrorBanner";
import Button from "../components/ui/Button";
import { cn } from "../components/ui/cn";

const TABS = [
  { key: "Basic", label: "Paste text" },
  { key: "Youtube", label: "YouTube link" },
  { key: "PDF", label: "Upload PDF" },
];

const CHAR_LIMIT = 8000;
const YOUTUBE_RE =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|v\/|embed\/|.+\?v=))([A-Za-z0-9_-]{11})(?:&t=\d+s)?$/;

const EMPTY = {
  Basic: { message: "" },
  Youtube: { message: "", youtube_url: "" },
  PDF: { message: "", file: null },
};

export default function FlashcardForm({
  subscription,
  onGenerated,
  setGenerating,
  setError,
  submitRef,
  onCanSubmitChange,
  onAccessBlocked,
}) {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("Basic");
  const [formData, setFormData] = useState(EMPTY.Basic);
  const [inputError, setInputError] = useState("");
  const polling = useRef(false);

  useEffect(() => () => {
    polling.current = false;
  }, []);

  const changeTab = (key) => {
    setTab(key);
    setFormData(EMPTY[key]);
    setInputError("");
  };

  const chars = (formData.message || "").length;
  const estCards = Math.max(1, Math.round(chars / 350));

  let canSubmit;
  if (tab === "Basic") canSubmit = formData.message.trim().length > 0;
  else if (tab === "Youtube") canSubmit = YOUTUBE_RE.test((formData.youtube_url || "").trim());
  else canSubmit = formData.file instanceof File;

  const runGeneration = async () => {
    const subData =
      queryClient.getQueryData([session.user.id, "subscriptionData"]) || subscription;
    const { plan, generations, subscriptionEndTime } = subData;
    if (
      (plan !== "Free" || generations >= 3) &&
      (plan === "Free" || Date.now() > subscriptionEndTime)
    ) {
      onAccessBlocked(plan === "Free" ? "limit" : "lapsed");
      return;
    }

    const payload = new FormData();
    if (tab === "Basic") {
      if (!formData.message.trim()) {
        setInputError("Please add some text to work from");
        return;
      }
    } else if (tab === "Youtube") {
      const url = (formData.youtube_url || "").trim();
      if (!url) {
        setInputError("Please enter a YouTube URL");
        return;
      }
      if (!YOUTUBE_RE.test(url)) {
        setInputError("That doesn't look like a valid YouTube URL");
        return;
      }
      payload.append("youtube_url", url);
    } else if (!(formData.file instanceof File) || formData.file.type !== "application/pdf") {
      setInputError("Please upload a valid PDF file");
      return;
    } else {
      payload.append("file", formData.file);
    }

    setInputError("");
    setGenerating(true);
    payload.append("message", formData.message || "");
    payload.append("method", tab);
    payload.append("plan", plan);

    const token = await session.getToken();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to start generation");
      const { task_id: taskId } = await response.json();

      polling.current = true;
      const deadline = Date.now() + 3 * 60 * 1000;
      const poll = async () => {
        try {
          if (Date.now() > deadline) throw new Error("Generation timed out");

          const statusRes = await fetch(`/api/generate/status/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!statusRes.ok) throw new Error("Unable to check generation status");
          const data = await statusRes.json();
          if (!polling.current) return;

          if (data.status === "SUCCESS") {
            if (plan === "Free") {
              await fetch("/api/increment-generations", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });
              queryClient.setQueryData([session.user.id, "subscriptionData"], (old) =>
                old ? { ...old, generations: old.generations + 1 } : old
              );
            }
            onGenerated(JSON.parse(data.flashcards));
            polling.current = false;
            setGenerating(false);
          } else if (data.status === "FAILURE") {
            throw new Error(data.error || "Generation failed");
          } else {
            setTimeout(poll, 2000);
          }
        } catch (err) {
          polling.current = false;
          setGenerating(false);
          setError(err?.message || true);
        }
      };
      poll();
    } catch (err) {
      setGenerating(false);
      setError(err?.message || true);
    }
  };

  useEffect(() => {
    if (submitRef) submitRef.current = runGeneration;
  });

  useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  return (
    <div className="rounded-xl border border-hairline bg-surface">
      <div className="flex border-b border-rule">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => changeTab(item.key)}
            className={cn(
              "border-b-2 px-5 py-4 text-[13px] font-medium transition-colors",
              tab === item.key
                ? "border-accent text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-5.5">
        <ErrorBanner>{inputError}</ErrorBanner>

        {tab === "Basic" ? (
          <InputField
            name="message"
            label="Your material"
            value={formData}
            setValue={setFormData}
            minHeight={132}
            maxLength={CHAR_LIMIT}
            placeholder="Paste lecture notes, an article, a chapter…"
          />
        ) : null}

        {tab === "Youtube" ? (
          <>
            <InputField
              type="input"
              name="youtube_url"
              label="YouTube URL"
              value={formData}
              setValue={setFormData}
              placeholder="https://youtube.com/watch?v=…"
            />
            <InputField
              name="message"
              label="Extra context (optional)"
              value={formData}
              setValue={setFormData}
              minHeight={88}
              placeholder="Anything that should steer the cards"
            />
          </>
        ) : null}

        {tab === "PDF" ? (
          <>
            <div className="flex flex-col gap-2">
              <span className="mono-label">PDF file</span>
              <DropFileInput
                formData={formData}
                setFormData={setFormData}
                setInputError={setInputError}
              />
            </div>
            <InputField
              name="message"
              label="Extra context (optional)"
              value={formData}
              setValue={setFormData}
              minHeight={88}
              placeholder="Anything that should steer the cards"
            />
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-rule px-5.5 py-4 max-[600px]:flex-col max-[600px]:items-stretch max-[600px]:gap-3">
        <span className="mono-meta text-ink-faint">
          {chars.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} chars · est. {estCards} cards
        </span>
        <Button onClick={runGeneration} disabled={!canSubmit}>
          Generate flashcards
        </Button>
      </div>
    </div>
  );
}

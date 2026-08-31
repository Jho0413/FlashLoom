"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../components/ui/cn";

export default function StudyView({ cards }) {
  const total = cards.length;
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = useMemo(() => cards[order[index]] ?? {}, [cards, order, index]);
  const number = String(index + 1).padStart(2, "0");

  const go = useCallback(
    (delta) => {
      setFlipped(false);
      setIndex((current) => (current + delta + total) % total);
    },
    [total]
  );

  const flip = useCallback(() => setFlipped((value) => !value), []);

  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setIndex(0);
    setFlipped(false);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, flip]);

  if (total === 0) return null;

  return (
    <div className="mx-auto flex max-w-[560px] flex-col">
      <div className="flex items-center justify-between">
        <span className="mono-meta text-ink-faint">
          {number} / {String(total).padStart(2, "0")}
        </span>
        <button type="button" onClick={shuffle} className="mono-meta text-ink-muted hover:text-ink">
          shuffle
        </button>
      </div>
      <div className="mt-2 h-px w-full bg-rule">
        <div
          className="h-px bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`Card ${number}, ${flipped ? "answer" : "question"} showing. Activate to flip.`}
        onClick={flip}
        className={cn("flashcard flashcard--study mt-6 w-full cursor-pointer", flipped && "flashcard--flipped")}
      >
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="mono-label">Card {number}</span>
            <p className="text-pretty text-[19px] font-medium leading-[1.4] text-ink">
              {card.front || "No question provided"}
            </p>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">flip &rarr;</span>
          </div>
          <div className="flashcard__face flashcard__face--back">
            <span className="font-mono text-[11px] tracking-[0.02em] text-accent">{number} &middot; answer</span>
            <p className="text-pretty text-[17px] leading-[1.5] text-ink-secondary">
              {card.back || "No answer provided"}
            </p>
            <span className="mono-label">&larr; back</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="flex items-center gap-2 rounded-sm border border-hairline-strong px-[15px] py-[9px] text-[13px] font-medium text-ink hover:bg-surface"
        >
          <span aria-hidden="true">&larr;</span> Prev
        </button>
        <span className="mono-meta text-center text-ink-faint max-[600px]:hidden">
          space to flip · &larr; &rarr; to move
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          className="flex items-center gap-2 rounded-sm border border-hairline-strong px-[15px] py-[9px] text-[13px] font-medium text-ink hover:bg-surface"
        >
          Next <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}

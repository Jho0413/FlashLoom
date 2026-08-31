"use client";

import { useState } from "react";

export default function Flashcard({ front, back, index }) {
  const [flipped, setFlipped] = useState(false);
  const [settled, setSettled] = useState(true);
  const number = String(index + 1).padStart(2, "0");

  const toggle = () => {
    setSettled(false);
    setFlipped((value) => !value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`Card ${number}, ${flipped ? "answer" : "question"} showing. Activate to flip.`}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={`flashcard cursor-pointer${flipped ? " flashcard--flipped" : ""}`}
    >
      <div className="flashcard__inner" onTransitionEnd={() => setSettled(true)}>
        <div
          className="flashcard__face flashcard__face--front"
          aria-hidden={settled && flipped ? "true" : undefined}
        >
          <span className="mono-label shrink-0">Card {number}</span>
          <p className="my-2 min-h-0 flex-1 overflow-y-auto text-pretty text-[16px] font-medium leading-[1.45] text-ink">
            {front || "No question provided"}
          </p>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            flip &rarr;
          </span>
        </div>
        <div
          className="flashcard__face flashcard__face--back"
          aria-hidden={settled && !flipped ? "true" : undefined}
        >
          <span className="shrink-0 font-mono text-[11px] tracking-[0.02em] text-accent">
            {number} &middot; answer
          </span>
          <p className="my-2 min-h-0 flex-1 overflow-y-auto text-pretty text-[15px] leading-[1.55] text-ink-secondary">
            {back || "No answer provided"}
          </p>
          <span className="mono-label shrink-0">&larr; back</span>
        </div>
      </div>
    </div>
  );
}

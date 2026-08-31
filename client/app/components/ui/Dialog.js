"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Dialog({
  open,
  onClose,
  title,
  titleId = "dialog-title",
  dismissable = true,
  children,
  actions,
}) {
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  const close = useCallback(() => {
    if (dismissable && onClose) onClose();
  }, [dismissable, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    (panel?.querySelector(FOCUSABLE) || panel)?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const nodes = panel.querySelectorAll(FOCUSABLE);
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px] max-[600px]:items-end max-[600px]:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative w-full max-w-[460px] rounded-xl border border-hairline bg-surface p-6.5 shadow-dialog max-[600px]:rounded-b-none max-[600px]:rounded-t-xl"
      >
        {title ? (
          <h2 id={titleId} className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h2>
        ) : null}
        {children ? (
          <div className="mt-3 text-[14px] leading-[1.6] text-ink-muted">{children}</div>
        ) : null}
        {actions ? <div className="mt-6 flex justify-end gap-[9px]">{actions}</div> : null}
      </div>
    </div>,
    document.body
  );
}

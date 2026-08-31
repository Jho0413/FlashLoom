"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

export default function Menu({ trigger, items, align = "right" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <span
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setOpen((value) => !value);
        }}
      >
        {trigger}
      </span>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-20 mt-1 w-[168px] rounded-md border border-hairline bg-surface p-[5px] shadow-menu",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => (
            <div key={item.label}>
              {item.separatorBefore ? <div className="my-[5px] h-px bg-rule" /> : null}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(false);
                  item.onClick?.();
                }}
                className={cn(
                  "block w-full rounded-[5px] px-[11px] py-[9px] text-left text-[13px] transition-colors duration-150",
                  item.disabled && "cursor-not-allowed text-ink-faint",
                  !item.disabled && item.danger && "text-danger hover:bg-danger-bg",
                  !item.disabled && !item.danger && "text-ink hover:bg-surface-sunken"
                )}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

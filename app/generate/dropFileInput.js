"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 20 * 1024 * 1024;

function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function DropFileInput({ formData, setFormData, setInputError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const accept = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setInputError("Please upload a valid PDF file");
      return;
    }
    if (file.size > MAX_BYTES) {
      setInputError("That PDF is over the 20 MB limit");
      return;
    }
    setInputError("");
    setFormData((prev) => ({ ...prev, file }));
  };

  const remove = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[132px] flex-col items-center justify-center rounded-md border border-dashed px-4 text-center transition-colors ${
          dragging ? "border-accent bg-surface-accent" : "border-hairline-strong bg-transparent"
        }`}
      >
        <span className="mono-meta text-ink-muted">Drop a PDF or click to browse · max 20 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept="application/pdf"
        hidden
        onChange={(event) => accept(event.target.files?.[0])}
      />
      {formData.file ? (
        <div className="flex items-center justify-between rounded-md border border-hairline bg-surface-sunken px-3 py-2">
          <span className="truncate text-[14px] font-medium text-ink">{formData.file.name}</span>
          <div className="flex shrink-0 items-center gap-3">
            <span className="mono-meta text-ink-faint">{formatSize(formData.file.size)}</span>
            <button
              type="button"
              onClick={remove}
              aria-label="Remove file"
              className="font-mono text-ink-faint hover:text-ink"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

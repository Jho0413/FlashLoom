"use client";

import { createPortal } from "react-dom";
import Spinner from "../ui/Spinner";

export default function LoadingModal({ loading }) {
  if (!loading || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
      <Spinner size={26} className="text-white" />
    </div>,
    document.body
  );
}

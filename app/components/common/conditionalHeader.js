"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

const HIDDEN_PREFIXES = ["/sign-in", "/sign-up", "/result"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
  return <Header />;
}

"use client";

import { useSearchParams } from "next/navigation";
import MainLayout from "../components/common/mainLayout";

export default function FlashcardLayout({ children }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  return (
    <Suspense>
      <MainLayout title={name}>{children}</MainLayout>
    </Suspense>
  )
}
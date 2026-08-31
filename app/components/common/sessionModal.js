"use client";

import { useRouter } from "next/navigation";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";

export default function SessionModal({ sessionExpired }) {
  const router = useRouter();

  return (
    <Dialog
      open={!!sessionExpired}
      dismissable={false}
      title="Session expired"
      actions={<Button onClick={() => router.push("/sign-in")}>Sign in</Button>}
    >
      Your session timed out. Sign in again to keep going.
    </Dialog>
  );
}

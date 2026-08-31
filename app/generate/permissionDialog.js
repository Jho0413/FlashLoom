"use client";

import { useRouter } from "next/navigation";
import Dialog from "../components/ui/Dialog";
import Button from "../components/ui/Button";

export default function PermissionDialog({ open, reason = "limit", onClose }) {
  const router = useRouter();
  const lapsed = reason === "lapsed";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dismissable={Boolean(onClose)}
      title={lapsed ? "Your subscription has ended" : "You've used all 3 free generations"}
      actions={
        <>
          {onClose ? (
            <Button variant="secondary" onClick={onClose}>
              Maybe later
            </Button>
          ) : null}
          <Button onClick={() => router.push(lapsed ? "/subscription" : "/#pricing")}>
            {lapsed ? "Manage subscription" : "See plans"}
          </Button>
        </>
      }
    >
      {lapsed
        ? "Your plan is no longer active. Renew it to keep generating flashcard sets."
        : "Free accounts include three generations. Upgrade to a paid plan for unlimited sets."}
    </Dialog>
  );
}

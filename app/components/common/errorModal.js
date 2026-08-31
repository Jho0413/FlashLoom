"use client";

import Dialog from "../ui/Dialog";
import Button from "../ui/Button";

export default function ErrorModal({ error, setError }) {
  return (
    <Dialog
      open={!!error}
      onClose={() => setError(false)}
      title="Something went wrong"
      actions={
        <Button variant="secondary" onClick={() => setError(false)}>
          Dismiss
        </Button>
      }
    >
      {typeof error === "string"
        ? error
        : "We hit an issue completing that. Please try again in a moment."}
    </Dialog>
  );
}

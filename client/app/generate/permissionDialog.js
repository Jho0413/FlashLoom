"use client"

import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useRouter } from "next/navigation";

const PermissionDialog = ({ access }) => {

    const router = useRouter();

    return (
      <Dialog open={!access} onClose={() => router.push("/")}>
        <DialogTitle>Upgrade your plan to continue generating</DialogTitle>
        <DialogContent>Go back to the home page to view the plans!</DialogContent>
      </Dialog>
    )
}

export default PermissionDialog;
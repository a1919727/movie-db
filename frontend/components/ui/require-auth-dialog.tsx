"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RequireAuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequireAuthDialog({
  open,
  onOpenChange,
}: RequireAuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-h-[180px] max-w-xl px-8 py-8 md:px-10 md:py-10">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>Please sign in first.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

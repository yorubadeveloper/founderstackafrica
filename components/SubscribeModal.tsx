"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { EmailCapture } from "@/components/EmailCapture"

interface SubscribeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscribeModal({ open, onOpenChange }: SubscribeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get updates</DialogTitle>
          <DialogDescription>
            New tools and guides, straight to your inbox. No spam.
          </DialogDescription>
        </DialogHeader>
        <EmailCapture />
      </DialogContent>
    </Dialog>
  )
}

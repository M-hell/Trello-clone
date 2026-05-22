"use client";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", danger = true, onConfirm, onClose, loading = false }) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose} size="sm">
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} type="button" disabled={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
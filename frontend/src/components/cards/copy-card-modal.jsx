"use client";

import { useEffect, useMemo, useState } from "react";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsersThunk, selectUsers } from "@/store/slices/users-slice";

export default function CopyCardModal({ open, onClose, onSubmit, card, loading }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedUserId("");
      dispatch(fetchUsersThunk());
    }
  }, [dispatch, open]);

  const options = useMemo(() => users.filter((user) => user.id !== card?.user_id), [card?.user_id, users]);

  return (
    <Modal open={open} title="Copy card to another user" description={card?.card_name || "Choose a user to duplicate this board column."} onClose={onClose} size="sm">
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Select user</span>
          <select
            className="h-11 w-full rounded-2xl border border-white/70 bg-white/85 px-4 text-sm text-slate-900 shadow-sm shadow-orange-500/5 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-200/60"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
          >
            <option value="">Choose a teammate</option>
            {options.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedUserId || loading}
            onClick={() => onSubmit({ card_id: card?.id, transferuserid: Number(selectedUserId) })}
          >
            {loading ? "Copying..." : "Copy card"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { createActivity } from "@/lib/firebase/customers";
import type { Contact } from "@/types/customer";
import type { Dictionary } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

interface CallMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  contact: Contact;
  dict: Dictionary;
  onSaved: () => void;
}

export function CallMemoDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
  contact,
  dict,
  onSaved,
}: CallMemoDialogProps) {
  const { user } = useAuth();
  const [duration, setDuration] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      await createActivity(
        {
          customerId,
          type: "call",
          phone: contact.phone,
          contactName: contact.name,
          duration: duration ? parseInt(duration, 10) * 60 : undefined,
          memo,
          createdBy: user.uid,
        },
        user.uid
      );
      setDuration("");
      setMemo("");
      onSaved();
    } catch {
      // Error handling - could show toast
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDuration("");
    setMemo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📞 {dict.activity.callMemo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Info */}
          <div className="text-sm">
            <div className="text-muted-foreground">고객</div>
            <div className="font-medium">{customerName}</div>
          </div>

          {/* Contact Info */}
          <div className="text-sm">
            <div className="text-muted-foreground">연락처</div>
            <div className="font-medium">
              {contact.name} ({contact.phone})
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">{dict.activity.duration}</Label>
            <Input
              id="duration"
              type="number"
              inputMode="numeric"
              placeholder="5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">{dict.activity.memo}</Label>
            <textarea
              id="memo"
              placeholder="통화 내용을 입력하세요..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            {dict.common.cancel}
          </Button>
          <Button onClick={handleSave} disabled={saving || !memo.trim()}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {dict.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import type { Contact } from "@/types/customer";
import type { Dictionary } from "@/lib/i18n";

interface ContactCardProps {
  contact: Contact;
  role: string;
  dict: Dictionary;
  onCall: (contact: Contact) => void;
}

export function ContactCard({ contact, role, dict, onCall }: ContactCardProps) {
  const handleCallClick = () => {
    onCall(contact);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{contact.name}</span>
          <Badge variant="outline" className="text-xs">
            {role}
          </Badge>
        </div>
        {contact.lineId && (
          <div className="text-xs text-muted-foreground mt-0.5">
            LINE: {contact.lineId}
          </div>
        )}
      </div>
      <Button
        variant="default"
        size="sm"
        className="h-10 px-4 gap-2"
        onClick={handleCallClick}
      >
        <Phone className="h-4 w-4" />
        {contact.phone}
      </Button>
    </div>
  );
}

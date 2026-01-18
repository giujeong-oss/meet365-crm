"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/customer";
import type { Dictionary, Locale } from "@/lib/i18n";

interface CustomerCardProps {
  customer: Customer;
  dict: Dictionary;
  lang: Locale;
}

const gradeEmojis = {
  A: "🥇",
  B: "🥈",
  C: "🥉",
};

export function CustomerCard({ customer, dict, lang }: CustomerCardProps) {
  const displayName = customer.name[lang] || customer.name.ko || customer.name.en;
  const primaryPhone = customer.contacts.primary?.phone;

  return (
    <Link href={`/${lang}/customers/${customer.customerId}`}>
      <Card className="hover:bg-accent/50 transition-colors active:bg-accent">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{gradeEmojis[customer.grade]}</span>
                <h3 className="font-semibold truncate">{displayName}</h3>
                <Badge variant="secondary" className="shrink-0">
                  {customer.shortCode}
                </Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <span>{dict.customer.businessTypes[customer.businessType]}</span>
                {primaryPhone && (
                  <>
                    <span className="mx-1">·</span>
                    <span>{primaryPhone}</span>
                  </>
                )}
              </div>
            </div>
            <Badge
              variant={customer.status === "active" ? "default" : "outline"}
              className="shrink-0"
            >
              {dict.customer.statuses[customer.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

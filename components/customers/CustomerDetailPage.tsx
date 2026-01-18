"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "./ContactCard";
import { ActivityLog } from "@/components/activities/ActivityLog";
import { CallMemoDialog } from "@/components/activities/CallMemoDialog";
import { getCustomerById } from "@/lib/firebase/customers";
import type { Customer, Contact } from "@/types/customer";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CustomerDetailPageProps {
  customerId: string;
  dict: Dictionary;
  lang: Locale;
}

const gradeEmojis = {
  A: "🥇",
  B: "🥈",
  C: "🥉",
};

export function CustomerDetailPage({ customerId, dict, lang }: CustomerDetailPageProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callMemoOpen, setCallMemoOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCustomerById(customerId);
        if (!data) {
          setError(dict.common.noData);
        } else {
          setCustomer(data);
        }
      } catch {
        setError(dict.common.error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [customerId, dict]);

  const handleCallClick = (contact: Contact) => {
    setSelectedContact(contact);
    // Open phone dialer
    window.location.href = `tel:${contact.phone}`;
    // Show memo dialog after a short delay (user returns from call)
    setTimeout(() => {
      setCallMemoOpen(true);
    }, 500);
  };

  const handleMemoSaved = () => {
    setCallMemoOpen(false);
    setSelectedContact(null);
    setRefreshKey((prev) => prev + 1);
  };

  const displayName = customer?.name[lang] || customer?.name.ko || customer?.name.en || "";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-bold text-lg truncate">{displayName}</h1>
            </div>
            <Button variant="outline" size="sm">
              {dict.common.edit}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 max-w-2xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : customer ? (
            <>
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    📋 {dict.customer.info}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.customer.code}</span>
                    <span>{customer.shortCode} ({customer.peakCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.customer.type}</span>
                    <span>{dict.customer.businessTypes[customer.businessType]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{dict.customer.grade}</span>
                    <span>{gradeEmojis[customer.grade]} {dict.customer.grades[customer.grade]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{dict.customer.status}</span>
                    <Badge variant={customer.status === "active" ? "default" : "outline"}>
                      {dict.customer.statuses[customer.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contacts */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    📞 {dict.customer.contacts}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ContactCard
                    contact={customer.contacts.primary}
                    role={dict.contact.primary}
                    dict={dict}
                    onCall={handleCallClick}
                  />
                  {customer.contacts.ordering && (
                    <ContactCard
                      contact={customer.contacts.ordering}
                      role={dict.contact.ordering}
                      dict={dict}
                      onCall={handleCallClick}
                    />
                  )}
                  {customer.contacts.accounting && (
                    <ContactCard
                      contact={customer.contacts.accounting}
                      role={dict.contact.accounting}
                      dict={dict}
                      onCall={handleCallClick}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Activity Log */}
              <ActivityLog
                customerId={customerId}
                dict={dict}
                refreshKey={refreshKey}
              />
            </>
          ) : null}
        </main>

        {/* Call Memo Dialog */}
        {customer && selectedContact && (
          <CallMemoDialog
            open={callMemoOpen}
            onOpenChange={setCallMemoOpen}
            customerId={customerId}
            customerName={displayName}
            contact={selectedContact}
            dict={dict}
            onSaved={handleMemoSaved}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

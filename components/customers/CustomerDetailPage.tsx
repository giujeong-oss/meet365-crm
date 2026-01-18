"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "./ContactCard";
import { CustomerForm, type CustomerFormData } from "./CustomerForm";
import { ActivityLog } from "@/components/activities/ActivityLog";
import { CallMemoDialog } from "@/components/activities/CallMemoDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomerById, updateCustomer } from "@/lib/firebase/customers";
import type { Customer, Contact } from "@/types/customer";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ArrowLeft, Loader2, X } from "lucide-react";

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
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callMemoOpen, setCallMemoOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const handleCallClick = (contact: Contact) => {
    setSelectedContact(contact);
    window.location.href = `tel:${contact.phone}`;
    setTimeout(() => {
      setCallMemoOpen(true);
    }, 500);
  };

  const handleMemoSaved = () => {
    setCallMemoOpen(false);
    setSelectedContact(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditSubmit = async (data: CustomerFormData) => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      await updateCustomer(customerId, data, user.uid);
      await loadCustomer();
      setIsEditing(false);
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
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
                onClick={() => isEditing ? setIsEditing(false) : router.back()}
              >
                {isEditing ? <X className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <h1 className="font-bold text-lg truncate">
                {isEditing ? "고객 수정" : displayName}
              </h1>
            </div>
            {!isEditing && customer && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                {dict.common.edit}
              </Button>
            )}
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
            isEditing ? (
              <CustomerForm
                dict={dict}
                initialData={customer}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                isLoading={isSaving}
              />
            ) : (
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
                    {customer.note && (
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground">메모: </span>
                        <span>{customer.note}</span>
                      </div>
                    )}
                    {customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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

                {/* Delivery Info */}
                {(customer.deliveryAddress?.address || customer.preferredDeliveryTime) && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        📍 배송 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {customer.deliveryAddress?.address && (
                        <div>
                          <span className="text-muted-foreground">주소: </span>
                          <span>{customer.deliveryAddress.address}</span>
                        </div>
                      )}
                      {customer.deliveryAddress?.googleMapsUrl && (
                        <div>
                          <a
                            href={customer.deliveryAddress.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            구글맵에서 보기 →
                          </a>
                        </div>
                      )}
                      {customer.preferredDeliveryTime && (
                        <div>
                          <span className="text-muted-foreground">선호 배송 시간: </span>
                          <span>{customer.preferredDeliveryTime}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Operating Hours & Line Group */}
                {(customer.operatingHours?.open || customer.lineGroupUrl) && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        🕐 운영 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {customer.operatingHours?.open && customer.operatingHours?.close && (
                        <div>
                          <span className="text-muted-foreground">운영 시간: </span>
                          <span>{customer.operatingHours.open} - {customer.operatingHours.close}</span>
                        </div>
                      )}
                      {customer.lineGroupUrl && (
                        <div>
                          <a
                            href={customer.lineGroupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 underline"
                          >
                            라인 그룹 열기 →
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Menu Photos */}
                {customer.menuPhotos && customer.menuPhotos.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        📸 메뉴 사진
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {customer.menuPhotos.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={url}
                              alt={`Menu ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md border hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Issues */}
                {customer.issues && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                        ⚠️ 이슈 사항
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-orange-800 whitespace-pre-wrap">{customer.issues}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Activity Log */}
                <ActivityLog
                  customerId={customerId}
                  dict={dict}
                  refreshKey={refreshKey}
                />
              </>
            )
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

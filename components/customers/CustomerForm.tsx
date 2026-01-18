"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer, BusinessType, CustomerStatus, CustomerGrade, Contact } from "@/types/customer";
import type { Dictionary } from "@/lib/i18n";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CustomerFormProps {
  dict: Dictionary;
  initialData?: Partial<Customer>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface CustomerFormData {
  peakCode: string;
  shortCode: string;
  name: {
    ko: string;
    th: string;
    en: string;
  };
  businessType: BusinessType;
  contacts: {
    primary: Contact;
    ordering?: Contact;
    accounting?: Contact;
  };
  status: CustomerStatus;
  grade: CustomerGrade;
  tags: string[];
  note: string;
}

const businessTypes: BusinessType[] = ["restaurant", "hotel", "catering", "retail"];
const statuses: CustomerStatus[] = ["active", "inactive", "pending"];
const grades: CustomerGrade[] = ["A", "B", "C"];

export function CustomerForm({
  dict,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    peakCode: initialData?.peakCode || "",
    shortCode: initialData?.shortCode || "",
    name: initialData?.name || { ko: "", th: "", en: "" },
    businessType: initialData?.businessType || "restaurant",
    contacts: initialData?.contacts || {
      primary: { name: "", phone: "", role: "" },
    },
    status: initialData?.status || "active",
    grade: initialData?.grade || "B",
    tags: initialData?.tags || [],
    note: initialData?.note || "",
  });

  const [tagInput, setTagInput] = useState("");
  const [showOrdering, setShowOrdering] = useState(!!initialData?.contacts?.ordering);
  const [showAccounting, setShowAccounting] = useState(!!initialData?.contacts?.accounting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateContact = (
    type: "primary" | "ordering" | "accounting",
    field: keyof Contact,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [type]: {
          ...prev.contacts[type],
          [field]: value,
        },
      },
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📋 {dict.customer.info}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peakCode">Peak Code</Label>
              <Input
                id="peakCode"
                value={formData.peakCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, peakCode: e.target.value }))}
                placeholder="MT-0001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortCode">Short Code</Label>
              <Input
                id="shortCode"
                value={formData.shortCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortCode: e.target.value }))}
                placeholder="SR3"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>이름 (한국어)</Label>
            <Input
              value={formData.name.ko}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: { ...prev.name, ko: e.target.value } }))}
              placeholder="서울갈비"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>ชื่อ (ไทย)</Label>
            <Input
              value={formData.name.th}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: { ...prev.name, th: e.target.value } }))}
              placeholder="โซลกัลบี้"
            />
          </div>
          <div className="space-y-2">
            <Label>Name (English)</Label>
            <Input
              value={formData.name.en}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
              placeholder="Seoul Galbi"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{dict.customer.type}</Label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData((prev) => ({ ...prev, businessType: e.target.value as BusinessType }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {dict.customer.businessTypes[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{dict.customer.grade}</Label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value as CustomerGrade }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {dict.customer.grades[grade]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{dict.customer.status}</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CustomerStatus }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {dict.customer.statuses[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📞 {dict.customer.contacts}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Contact */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-3">
            <Label className="font-medium">{dict.contact.primary}</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="이름"
                value={formData.contacts.primary.name}
                onChange={(e) => updateContact("primary", "name", e.target.value)}
                required
              />
              <Input
                placeholder="전화번호"
                value={formData.contacts.primary.phone}
                onChange={(e) => updateContact("primary", "phone", e.target.value)}
                required
              />
              <Input
                placeholder="역할"
                value={formData.contacts.primary.role}
                onChange={(e) => updateContact("primary", "role", e.target.value)}
              />
              <Input
                placeholder="Line ID"
                value={formData.contacts.primary.lineId || ""}
                onChange={(e) => updateContact("primary", "lineId", e.target.value)}
              />
            </div>
          </div>

          {/* Ordering Contact */}
          {showOrdering ? (
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">{dict.contact.ordering}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowOrdering(false);
                    setFormData((prev) => ({
                      ...prev,
                      contacts: { ...prev.contacts, ordering: undefined },
                    }));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="이름"
                  value={formData.contacts.ordering?.name || ""}
                  onChange={(e) => updateContact("ordering", "name", e.target.value)}
                />
                <Input
                  placeholder="전화번호"
                  value={formData.contacts.ordering?.phone || ""}
                  onChange={(e) => updateContact("ordering", "phone", e.target.value)}
                />
                <Input
                  placeholder="역할"
                  value={formData.contacts.ordering?.role || ""}
                  onChange={(e) => updateContact("ordering", "role", e.target.value)}
                />
                <Input
                  placeholder="Line ID"
                  value={formData.contacts.ordering?.lineId || ""}
                  onChange={(e) => updateContact("ordering", "lineId", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowOrdering(true);
                setFormData((prev) => ({
                  ...prev,
                  contacts: {
                    ...prev.contacts,
                    ordering: { name: "", phone: "", role: "" },
                  },
                }));
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> {dict.contact.ordering}
            </Button>
          )}

          {/* Accounting Contact */}
          {showAccounting ? (
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">{dict.contact.accounting}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAccounting(false);
                    setFormData((prev) => ({
                      ...prev,
                      contacts: { ...prev.contacts, accounting: undefined },
                    }));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="이름"
                  value={formData.contacts.accounting?.name || ""}
                  onChange={(e) => updateContact("accounting", "name", e.target.value)}
                />
                <Input
                  placeholder="전화번호"
                  value={formData.contacts.accounting?.phone || ""}
                  onChange={(e) => updateContact("accounting", "phone", e.target.value)}
                />
                <Input
                  placeholder="역할"
                  value={formData.contacts.accounting?.role || ""}
                  onChange={(e) => updateContact("accounting", "role", e.target.value)}
                />
                <Input
                  placeholder="Line ID"
                  value={formData.contacts.accounting?.lineId || ""}
                  onChange={(e) => updateContact("accounting", "lineId", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAccounting(true);
                setFormData((prev) => ({
                  ...prev,
                  contacts: {
                    ...prev.contacts,
                    accounting: { name: "", phone: "", role: "" },
                  },
                }));
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> {dict.contact.accounting}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tags & Note */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🏷️ 태그 & 메모</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>태그</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그 입력"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                추가
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">메모</Label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="고객 관련 메모..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-0 bg-gray-50 p-4 -mx-4 -mb-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          {dict.common.cancel}
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {dict.common.save}
        </Button>
      </div>
    </form>
  );
}

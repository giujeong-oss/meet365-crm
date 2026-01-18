"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CustomerForm, type CustomerFormData } from "./CustomerForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createCustomer } from "@/lib/firebase/customers";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

interface NewCustomerPageProps {
  dict: Dictionary;
  lang: Locale;
}

export function NewCustomerPage({ dict, lang }: NewCustomerPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const customerId = await createCustomer(
        {
          customerId: `CUST-${Date.now()}`,
          ...data,
        },
        user.uid
      );
      router.push(`/${lang}/customers/${customerId}`);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center gap-2 px-4 h-14">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">고객 등록</h1>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto">
          <CustomerForm
            dict={dict}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}

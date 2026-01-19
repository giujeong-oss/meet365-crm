"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CustomerCard } from "./CustomerCard";
import { CustomerFilters } from "./CustomerFilters";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomers } from "@/lib/firebase/customers";
import { seedTestData } from "@/lib/firebase/seed";
import type { Customer, CustomerGrade, CustomerStatus } from "@/types/customer";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Loader2, Plus, Database } from "lucide-react";

interface CustomerListPageProps {
  dict: Dictionary;
  lang: Locale;
}

export function CustomerListPage({ dict, lang }: CustomerListPageProps) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    grade?: CustomerGrade;
    status?: CustomerStatus;
  }>({ search: "" });

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers({
        grade: filters.grade,
        status: filters.status,
        search: filters.search || undefined,
      });
      setCustomers(data);
    } catch {
      setError(dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  const handleSeedData = async () => {
    if (!user?.uid) return;
    setSeeding(true);
    try {
      await seedTestData(user.uid);
      await loadCustomers();
    } catch {
      // Error handling
    } finally {
      setSeeding(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="p-4 max-w-2xl mx-auto">
        <CustomerFilters
          dict={dict}
          filters={filters}
          onFilterChange={setFilters}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            {/* Seed Data Button - Always visible */}
            <div className="flex justify-end mt-4">
              <Button onClick={handleSeedData} disabled={seeding} variant="outline" size="sm">
                {seeding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                테스트 데이터 추가
              </Button>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{dict.common.noData}</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.customerId}
                    customer={customer}
                    dict={dict}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Floating Action Button */}
        <Link href={`/${lang}/customers/new`}>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </main>
    </ProtectedRoute>
  );
}

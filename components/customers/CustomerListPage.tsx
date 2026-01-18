"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CustomerCard } from "./CustomerCard";
import { CustomerFilters } from "./CustomerFilters";
import { getCustomers } from "@/lib/firebase/customers";
import type { Customer, CustomerGrade, CustomerStatus } from "@/types/customer";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

interface CustomerListPageProps {
  dict: Dictionary;
  lang: Locale;
}

export function CustomerListPage({ dict, lang }: CustomerListPageProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    grade?: CustomerGrade;
    status?: CustomerStatus;
  }>({ search: "" });

  useEffect(() => {
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
      } catch (err) {
        setError(dict.common.error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [filters, dict.common.error]);

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
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {dict.common.noData}
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
      </main>
    </ProtectedRoute>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { CustomerGrade, CustomerStatus } from "@/types/customer";

interface FiltersState {
  search: string;
  grade?: CustomerGrade;
  status?: CustomerStatus;
}

interface CustomerFiltersProps {
  dict: Dictionary;
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
}

const grades: (CustomerGrade | undefined)[] = [undefined, "A", "B", "C"];
const statuses: (CustomerStatus | undefined)[] = [undefined, "active", "inactive", "pending"];

export function CustomerFilters({ dict, filters, onFilterChange }: CustomerFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={dict.common.search}
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-9 h-11"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex gap-1">
          {grades.map((grade) => (
            <Button
              key={grade ?? "all-grade"}
              variant={filters.grade === grade ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({ ...filters, grade })}
              className="min-w-[48px] h-9"
            >
              {grade ? dict.customer.grades[grade] : dict.common.all}
            </Button>
          ))}
        </div>
        <div className="w-px bg-border" />
        <div className="flex gap-1">
          {statuses.map((status) => (
            <Button
              key={status ?? "all-status"}
              variant={filters.status === status ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({ ...filters, status })}
              className="min-w-[48px] h-9"
            >
              {status ? dict.customer.statuses[status] : dict.common.all}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivitiesByCustomer } from "@/lib/firebase/customers";
import type { Activity } from "@/types/customer";
import type { Dictionary } from "@/lib/i18n";
import { format } from "date-fns";
import { Loader2, Phone, MapPin, Mail, FileText } from "lucide-react";

interface ActivityLogProps {
  customerId: string;
  dict: Dictionary;
  refreshKey?: number;
}

const activityIcons = {
  call: Phone,
  visit: MapPin,
  email: Mail,
  note: FileText,
};

export function ActivityLog({ customerId, dict, refreshKey = 0 }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const data = await getActivitiesByCustomer(customerId, 20);
        setActivities(data);
      } catch {
        // Silently fail - activities are not critical
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [customerId, refreshKey]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          📝 {dict.activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {dict.common.noData}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const date = activity.createdAt?.toDate?.()
                ? format(activity.createdAt.toDate(), "MM/dd")
                : "";

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 text-sm border-b last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{date}</span>
                      <span className="font-medium">
                        {dict.activity.types[activity.type]}
                      </span>
                      {activity.contactName && (
                        <span className="text-muted-foreground">
                          {activity.contactName}
                        </span>
                      )}
                      {activity.duration && (
                        <span className="text-xs text-muted-foreground">
                          ({activity.duration}분)
                        </span>
                      )}
                    </div>
                    {activity.memo && (
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {activity.memo}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

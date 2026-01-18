"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogOut, User } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface HeaderProps {
  dict: Dictionary;
}

export function Header({ dict }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="font-bold text-lg">{dict.common.appName}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.email?.split("@")[0]}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title={dict.auth.logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

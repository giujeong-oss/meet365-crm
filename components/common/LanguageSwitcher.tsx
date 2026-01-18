"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { locales, type Locale } from "@/lib/i18n";

const localeNames: Record<Locale, string> = {
  ko: "한국어",
  th: "ไทย",
  en: "EN",
};

export function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = params.lang as Locale;

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the current locale in pathname with the new one
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLocale}`);

    // Set cookie to remember preference
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    router.push(newPathname);
  };

  return (
    <div className="flex gap-1">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLang === locale ? "default" : "ghost"}
          size="sm"
          onClick={() => handleLocaleChange(locale)}
          className="min-w-[48px] h-9"
        >
          {localeNames[locale]}
        </Button>
      ))}
    </div>
  );
}

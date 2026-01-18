import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Header } from "@/components/common/Header";
import { CustomerListPage } from "@/components/customers/CustomerListPage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang: Locale = isValidLocale(langParam) ? langParam : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dict={dict} />
      <CustomerListPage dict={dict} lang={lang} />
    </div>
  );
}

import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CustomerDetailPage } from "@/components/customers/CustomerDetailPage";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: langParam, id } = await params;
  const lang: Locale = isValidLocale(langParam) ? langParam : defaultLocale;
  const dict = await getDictionary(lang);

  return <CustomerDetailPage customerId={id} dict={dict} lang={lang} />;
}

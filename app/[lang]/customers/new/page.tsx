import { getDictionary, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { NewCustomerPage } from "@/components/customers/NewCustomerPage";

export default async function NewCustomer({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang: Locale = isValidLocale(langParam) ? langParam : defaultLocale;
  const dict = await getDictionary(lang);

  return <NewCustomerPage dict={dict} lang={lang} />;
}

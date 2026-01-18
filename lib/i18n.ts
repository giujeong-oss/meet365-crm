export const locales = ["ko", "th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export type Dictionary = {
  common: {
    appName: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    search: string;
    filter: string;
    all: string;
    noData: string;
  };
  auth: {
    login: string;
    logout: string;
    loginWithGoogle: string;
    loginDescription: string;
    domainError: string;
  };
  customer: {
    title: string;
    detail: string;
    info: string;
    code: string;
    type: string;
    grade: string;
    status: string;
    contacts: string;
    lastCall: string;
    daysAgo: string;
    weeksAgo: string;
    businessTypes: {
      restaurant: string;
      hotel: string;
      catering: string;
      retail: string;
    };
    statuses: {
      active: string;
      inactive: string;
      pending: string;
    };
    grades: {
      A: string;
      B: string;
      C: string;
    };
  };
  contact: {
    primary: string;
    ordering: string;
    accounting: string;
    call: string;
    line: string;
  };
  activity: {
    title: string;
    addMemo: string;
    callMemo: string;
    duration: string;
    memo: string;
    types: {
      call: string;
      visit: string;
      email: string;
      note: string;
    };
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("@/dictionaries/ko.json").then((module) => module.default),
  th: () => import("@/dictionaries/th.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

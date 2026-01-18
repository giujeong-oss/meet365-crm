import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";

const CUSTOMERS_COLLECTION = "crm/data/customers";

const testCustomers = [
  {
    customerId: "CUST-001",
    peakCode: "MT-0001",
    shortCode: "SR3",
    name: {
      ko: "서울갈비",
      th: "โซลกัลบี้",
      en: "Seoul Galbi",
    },
    businessType: "restaurant" as const,
    contacts: {
      primary: {
        name: "김사장",
        phone: "081-234-5678",
        lineId: "seoulkalbi",
        role: "대표",
      },
      ordering: {
        name: "이매니저",
        phone: "081-234-5679",
        role: "주문담당",
      },
    },
    status: "active" as const,
    grade: "A" as const,
    tags: ["단골", "대량주문"],
    note: "매주 화요일 정기 주문",
  },
  {
    customerId: "CUST-002",
    peakCode: "MT-0002",
    shortCode: "HK2",
    name: {
      ko: "한국관",
      th: "ฮันกุกกวาน",
      en: "Hankookgwan",
    },
    businessType: "restaurant" as const,
    contacts: {
      primary: {
        name: "박대표",
        phone: "089-111-2222",
        lineId: "hankook_rest",
        role: "대표",
      },
    },
    status: "active" as const,
    grade: "B" as const,
    tags: ["신규"],
    note: "",
  },
  {
    customerId: "CUST-003",
    peakCode: "MT-0003",
    shortCode: "BH1",
    name: {
      ko: "방콕호텔",
      th: "โรงแรมกรุงเทพ",
      en: "Bangkok Hotel",
    },
    businessType: "hotel" as const,
    contacts: {
      primary: {
        name: "Chef Kim",
        phone: "02-555-1234",
        role: "Executive Chef",
      },
      ordering: {
        name: "Ms. Suda",
        phone: "02-555-1235",
        lineId: "bkk_hotel_order",
        role: "Purchasing",
      },
      accounting: {
        name: "Mr. Somchai",
        phone: "02-555-1236",
        role: "Accounting",
      },
    },
    status: "active" as const,
    grade: "A" as const,
    tags: ["호텔", "대량주문", "VIP"],
    note: "월 2회 정기 미팅",
  },
  {
    customerId: "CUST-004",
    peakCode: "MT-0004",
    shortCode: "KC1",
    name: {
      ko: "킹케이터링",
      th: "คิงเคเทอริ่ง",
      en: "King Catering",
    },
    businessType: "catering" as const,
    contacts: {
      primary: {
        name: "정사장",
        phone: "095-888-9999",
        role: "대표",
      },
    },
    status: "pending" as const,
    grade: "C" as const,
    tags: ["신규문의"],
    note: "견적 요청 중",
  },
  {
    customerId: "CUST-005",
    peakCode: "MT-0005",
    shortCode: "KM1",
    name: {
      ko: "K마트",
      th: "เคมาร์ท",
      en: "K-Mart",
    },
    businessType: "retail" as const,
    contacts: {
      primary: {
        name: "최바이어",
        phone: "082-777-8888",
        lineId: "kmart_buyer",
        role: "바이어",
      },
    },
    status: "inactive" as const,
    grade: "B" as const,
    tags: ["소매", "휴면"],
    note: "2024년 12월부터 거래 중단",
  },
];

export async function seedTestData(userId: string): Promise<number> {
  const now = Timestamp.now();
  let count = 0;

  for (const customer of testCustomers) {
    const docRef = doc(collection(db, CUSTOMERS_COLLECTION), customer.customerId);
    await setDoc(docRef, {
      ...customer,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    });
    count++;
  }

  return count;
}

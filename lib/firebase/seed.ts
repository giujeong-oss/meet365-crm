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
    // New fields
    deliveryAddress: {
      address: "123 Sukhumvit Soi 23, Klongtoey, Bangkok 10110",
      googleMapsUrl: "https://maps.google.com/?q=13.7394,100.5614",
    },
    lineGroupUrl: "https://line.me/R/ti/g/abcd1234",
    operatingHours: {
      open: "11:00",
      close: "22:00",
    },
    preferredDeliveryTime: "오전 10시 전",
    menuPhotos: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    ],
    issues: "",
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
    // New fields
    deliveryAddress: {
      address: "456 Thonglor Soi 10, Bangkok",
      googleMapsUrl: "https://maps.google.com/?q=13.7320,100.5780",
    },
    operatingHours: {
      open: "10:00",
      close: "21:00",
    },
    preferredDeliveryTime: "점심 전 11시",
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
    // New fields
    deliveryAddress: {
      address: "999 Rama 1 Road, Pathumwan, Bangkok 10330",
      googleMapsUrl: "https://maps.google.com/?q=13.7465,100.5340",
    },
    lineGroupUrl: "https://line.me/R/ti/g/hotel5678",
    operatingHours: {
      open: "06:00",
      close: "23:00",
    },
    preferredDeliveryTime: "오전 8시 (주방 오픈 전)",
    menuPhotos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    ],
    issues: "주차장 진입 시 사전 연락 필수\n대형 트럭 진입 불가 - 1톤 차량만 가능",
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
    // New fields
    deliveryAddress: {
      address: "78 Ratchadaphisek Road, Bangkok",
    },
    preferredDeliveryTime: "유동적 - 행사 일정에 따름",
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
    // New fields
    deliveryAddress: {
      address: "Central Warehouse, Bangna-Trad Road",
      googleMapsUrl: "https://maps.google.com/?q=13.6631,100.6367",
    },
    operatingHours: {
      open: "08:00",
      close: "17:00",
    },
    issues: "결제 지연 이력 있음 - 선불 요청\n2024년 12월 미수금 정산 완료",
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

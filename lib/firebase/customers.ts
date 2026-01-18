import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Customer,
  CustomerInput,
  Activity,
  ActivityInput,
  CustomerGrade,
  CustomerStatus,
} from "@/types/customer";

const CUSTOMERS_COLLECTION = "crm/data/customers";
const ACTIVITIES_COLLECTION = "crm/data/activities";

// Customers
export async function getCustomers(filters?: {
  grade?: CustomerGrade;
  status?: CustomerStatus;
  search?: string;
}): Promise<Customer[]> {
  const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];

  if (filters?.grade) {
    constraints.unshift(where("grade", "==", filters.grade));
  }
  if (filters?.status) {
    constraints.unshift(where("status", "==", filters.status));
  }

  const q = query(collection(db, CUSTOMERS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  let customers = snapshot.docs.map((doc) => ({
    ...doc.data(),
    customerId: doc.id,
  })) as Customer[];

  // Client-side search filtering (Firestore doesn't support full-text search)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.ko.toLowerCase().includes(searchLower) ||
        c.name.th.toLowerCase().includes(searchLower) ||
        c.name.en.toLowerCase().includes(searchLower) ||
        c.shortCode.toLowerCase().includes(searchLower) ||
        c.peakCode.toLowerCase().includes(searchLower)
    );
  }

  return customers;
}

export async function getCustomerById(customerId: string): Promise<Customer | null> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { ...docSnap.data(), customerId: docSnap.id } as Customer;
}

export async function createCustomer(
  data: CustomerInput,
  userId: string
): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), {
    ...data,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });
  return docRef.id;
}

export async function updateCustomer(
  customerId: string,
  data: Partial<CustomerInput>,
  userId: string
): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });
}

// Activities
export async function getActivitiesByCustomer(
  customerId: string,
  limitCount = 20
): Promise<Activity[]> {
  const q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Activity[];
}

export async function getLastActivityByCustomer(
  customerId: string
): Promise<Activity | null> {
  const activities = await getActivitiesByCustomer(customerId, 1);
  return activities[0] || null;
}

export async function createActivity(
  data: ActivityInput,
  userId: string
): Promise<string> {
  const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    createdBy: userId,
  });
  return docRef.id;
}

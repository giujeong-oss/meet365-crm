import { Timestamp } from "firebase/firestore";

export type BusinessType = "restaurant" | "hotel" | "catering" | "retail";
export type CustomerStatus = "active" | "inactive" | "pending";
export type CustomerGrade = "A" | "B" | "C";
export type ActivityType = "call" | "visit" | "email" | "note";

export interface LocalizedName {
  ko: string;
  th: string;
  en: string;
}

export interface Contact {
  name: string;
  phone: string;
  lineId?: string;
  role: string;
}

export interface DeliveryAddress {
  address: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
}

export interface OperatingHours {
  open: string;
  close: string;
}

export interface Customer {
  customerId: string;
  peakCode: string;
  shortCode: string;
  name: LocalizedName;
  businessType: BusinessType;
  contacts: {
    primary: Contact;
    ordering?: Contact;
    accounting?: Contact;
  };
  status: CustomerStatus;
  grade: CustomerGrade;
  tags: string[];
  note: string;
  // New fields
  deliveryAddress?: DeliveryAddress;
  lineGroupUrl?: string;
  operatingHours?: OperatingHours;
  preferredDeliveryTime?: string;
  menuPhotos?: string[];
  issues?: string;
  // Audit fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface Activity {
  id?: string;
  customerId: string;
  type: ActivityType;
  phone?: string;
  contactName?: string;
  duration?: number;
  memo: string;
  createdBy: string;
  createdAt: Timestamp;
}

// For creating new documents (without server timestamps and audit fields)
export type CustomerInput = Omit<Customer, "createdAt" | "updatedAt" | "createdBy" | "updatedBy">;
export type ActivityInput = Omit<Activity, "id" | "createdAt" | "createdBy">;

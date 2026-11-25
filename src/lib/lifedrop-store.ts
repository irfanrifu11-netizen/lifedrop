"use client";

import { useSyncExternalStore } from "react";

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type Donor = {
  id: string;
  name: string;
  age: number;
  phone: string;
  bloodGroup: BloodGroup;
  place: string;
  consent: boolean;
  availability: string;
  createdAt: string;
};

export type DonorConnection = {
  requestId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  connectedAt: string;
};

export type Urgency = "Normal" | "Urgent" | "Critical";

export type BloodRequest = {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  place: string;
  contactName: string;
  phone: string;
  urgency: Urgency;
  note: string;
  createdAt: string;
};

const DONORS_KEY = "lifedrop.donors.v1";
const REQUESTS_KEY = "lifedrop.requests.v1";
const CONNECTIONS_KEY = "lifedrop.connections.v1";

export const seedDonors: Donor[] = [
  {
    id: "seed-1",
    name: "Aisha Rahman",
    age: 28,
    phone: "+91 98765 43210",
    bloodGroup: "O+",
    place: "Calicut",
    consent: true,
    availability: "Available",
    createdAt: "2026-01-12T08:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Rahul Menon",
    age: 34,
    phone: "+91 96456 71230",
    bloodGroup: "A+",
    place: "Kozhikode",
    consent: true,
    availability: "Available",
    createdAt: "2026-01-18T08:00:00.000Z",
  },
  {
    id: "seed-3",
    name: "Nisha Prakash",
    age: 25,
    phone: "+91 94478 22561",
    bloodGroup: "B+",
    place: "Calicut",
    consent: true,
    availability: "Available",
    createdAt: "2026-02-02T08:00:00.000Z",
  },
  {
    id: "seed-4",
    name: "Imran Haneef",
    age: 41,
    phone: "+91 97452 88910",
    bloodGroup: "AB+",
    place: "Vadakara",
    consent: true,
    availability: "Available",
    createdAt: "2026-02-14T08:00:00.000Z",
  },
  {
    id: "seed-5",
    name: "Sneha Thomas",
    age: 30,
    phone: "+91 99614 50328",
    bloodGroup: "O-",
    place: "Calicut",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "seed-6",
    name: "Arjun Nair",
    age: 37,
    phone: "+91 98951 66402",
    bloodGroup: "B-",
    place: "Kannur",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-09T08:00:00.000Z",
  },
  {
    id: "seed-7",
    name: "Fathima Noor",
    age: 29,
    phone: "+91 98470 11223",
    bloodGroup: "A-",
    place: "Calicut",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-11T08:00:00.000Z",
  },
  {
    id: "seed-8",
    name: "Vishnu Das",
    age: 32,
    phone: "+91 95671 33445",
    bloodGroup: "O+",
    place: "Malappuram",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-12T08:00:00.000Z",
  },
  {
    id: "seed-9",
    name: "Sana Fathima",
    age: 24,
    phone: "+91 97460 55667",
    bloodGroup: "AB-",
    place: "Kozhikode",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-13T08:00:00.000Z",
  },
  {
    id: "seed-10",
    name: "Jithin Raj",
    age: 35,
    phone: "+91 96330 77889",
    bloodGroup: "A+",
    place: "Calicut",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-14T08:00:00.000Z",
  },
  {
    id: "seed-11",
    name: "Maya Krishnan",
    age: 27,
    phone: "+91 99560 99112",
    bloodGroup: "B+",
    place: "Koyilandy",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-15T08:00:00.000Z",
  },
  {
    id: "seed-12",
    name: "Sameer Ali",
    age: 39,
    phone: "+91 98461 22334",
    bloodGroup: "O-",
    place: "Vadakara",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-16T08:00:00.000Z",
  },
  {
    id: "seed-13",
    name: "Ananya Varma",
    age: 31,
    phone: "+91 98950 44556",
    bloodGroup: "A+",
    place: "Ernakulam",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-17T08:00:00.000Z",
  },
  {
    id: "seed-14",
    name: "Rohit Pillai",
    age: 36,
    phone: "+91 94470 66778",
    bloodGroup: "B+",
    place: "Thiruvananthapuram",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-17T09:00:00.000Z",
  },
  {
    id: "seed-15",
    name: "Meera Joseph",
    age: 27,
    phone: "+91 96331 88990",
    bloodGroup: "O+",
    place: "Thrissur",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-18T08:00:00.000Z",
  },
  {
    id: "seed-16",
    name: "Naveen Kumar",
    age: 33,
    phone: "+91 97451 10112",
    bloodGroup: "AB+",
    place: "Palakkad",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-18T09:00:00.000Z",
  },
  {
    id: "seed-17",
    name: "Harsha Mohan",
    age: 26,
    phone: "+91 98472 13141",
    bloodGroup: "A-",
    place: "Kollam",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-19T08:00:00.000Z",
  },
  {
    id: "seed-18",
    name: "Dilna Shaji",
    age: 30,
    phone: "+91 95672 15161",
    bloodGroup: "B-",
    place: "Alappuzha",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-19T09:00:00.000Z",
  },
  {
    id: "seed-19",
    name: "Riyas K",
    age: 38,
    phone: "+91 99562 17181",
    bloodGroup: "O-",
    place: "Wayanad",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-20T08:00:00.000Z",
  },
  {
    id: "seed-20",
    name: "Athira Suresh",
    age: 29,
    phone: "+91 98953 19202",
    bloodGroup: "AB-",
    place: "Kottayam",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-20T09:00:00.000Z",
  },
  {
    id: "seed-21",
    name: "Deepak Menon",
    age: 34,
    phone: "+91 97455 21222",
    bloodGroup: "O+",
    place: "Idukki",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-21T08:00:00.000Z",
  },
  {
    id: "seed-22",
    name: "Reshma K P",
    age: 28,
    phone: "+91 98473 23242",
    bloodGroup: "A+",
    place: "Pathanamthitta",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-21T09:00:00.000Z",
  },
  {
    id: "seed-23",
    name: "Shafeeq Muhammed",
    age: 40,
    phone: "+91 96332 25262",
    bloodGroup: "B+",
    place: "Kasaragod",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-22T08:00:00.000Z",
  },
  {
    id: "seed-24",
    name: "Neethu Mathew",
    age: 32,
    phone: "+91 95673 27282",
    bloodGroup: "AB+",
    place: "Malappuram",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-22T09:00:00.000Z",
  },
  {
    id: "seed-25",
    name: "Abdul Basith",
    age: 26,
    phone: "+91 98954 29303",
    bloodGroup: "O-",
    place: "Kannur",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-23T08:00:00.000Z",
  },
  {
    id: "seed-26",
    name: "Keerthana R",
    age: 31,
    phone: "+91 97456 31323",
    bloodGroup: "A-",
    place: "Ernakulam",
    consent: true,
    availability: "Available",
    createdAt: "2026-03-23T09:00:00.000Z",
  },
];

export const seedRequests: BloodRequest[] = [
  {
    id: "request-1",
    patientName: "Child, 6 years",
    bloodGroup: "O+",
    place: "Calicut Medical College",
    contactName: "Hospital Desk",
    phone: "+91 495 272 2000",
    urgency: "Critical",
    note: "Needed for an emergency surgery today.",
    createdAt: "2026-03-18T06:30:00.000Z",
  },
  {
    id: "request-2",
    patientName: "Elderly patient",
    bloodGroup: "A+",
    place: "Kozhikode",
    contactName: "Family member",
    phone: "+91 90876 54321",
    urgency: "Urgent",
    note: "Two units requested for treatment this week.",
    createdAt: "2026-03-17T12:00:00.000Z",
  },
  {
    id: "request-3",
    patientName: "Accident victim",
    bloodGroup: "B+",
    place: "Calicut",
    contactName: "Duty Nurse",
    phone: "+91 94460 12345",
    urgency: "Critical",
    note: "One unit needed immediately.",
    createdAt: "2026-03-19T09:15:00.000Z",
  },
  {
    id: "request-4",
    patientName: "Surgery patient",
    bloodGroup: "O-",
    place: "Vadakara",
    contactName: "Ramesh",
    phone: "+91 90370 98765",
    urgency: "Urgent",
    note: "Surgery scheduled tomorrow morning.",
    createdAt: "2026-03-20T07:45:00.000Z",
  },
  {
    id: "request-5",
    patientName: "Mother, 29 years",
    bloodGroup: "AB-",
    place: "Kozhikode",
    contactName: "Husband",
    phone: "+91 98760 33445",
    urgency: "Normal",
    note: "One unit required for post-delivery care.",
    createdAt: "2026-03-21T11:00:00.000Z",
  },
  {
    id: "request-6",
    patientName: "Cancer patient",
    bloodGroup: "A-",
    place: "Calicut",
    contactName: "Caregiver",
    phone: "+91 95670 77881",
    urgency: "Urgent",
    note: "Platelet compatible donor preferred, please call first.",
    createdAt: "2026-03-22T10:30:00.000Z",
  },
];

type Listener = () => void;
type CacheEntry = { raw: string; value: unknown };

const listeners = new Set<Listener>();
const cache = new Map<string, CacheEntry>();
let donorsSnapshot: Donor[] | null = null;
let requestsSnapshot: BloodRequest[] | null = null;
let connectionsSnapshot: DonorConnection[] | null = null;
let remoteDonorsLoaded = false;

const emptyConnections: DonorConnection[] = [];

function notify() {
  donorsSnapshot = null;
  requestsSnapshot = null;
  connectionsSnapshot = null;
  listeners.forEach((listener) => listener());
}

export async function refreshDonorsFromSheet(): Promise<void> {
  if (typeof window === "undefined" || remoteDonorsLoaded) return;
  remoteDonorsLoaded = true;
  try {
    const response = await fetch("/api/donors", { cache: "no-store" });
    const result = (await response.json()) as {
      success?: boolean;
      donors?: unknown[];
    };
    if (result.success !== true || !Array.isArray(result.donors)) return;
    const remote = result.donors.map(normalizeDonor).filter(Boolean) as Donor[];
    if (remote.length === 0) return;
    const current = read<Donor[]>(DONORS_KEY, seedDonors);
    const byKey = new Map<string, Donor>();
    for (const donor of [...remote, ...current, ...seedDonors]) {
      const key = donor.phone.replace(/\D/g, "") || donor.id;
      if (!byKey.has(key)) byKey.set(key, donor);
    }
    write(DONORS_KEY, [...byKey.values()]);
  } catch {
    remoteDonorsLoaded = false;
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function normalizeBloodGroup(value: unknown): BloodGroup | null {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/VE$/i, "");
  return BLOOD_GROUPS.includes(normalized as BloodGroup)
    ? (normalized as BloodGroup)
    : null;
}

function normalizeDonor(value: unknown): Donor | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const name = String(row.name ?? "").trim();
  const bloodGroup = normalizeBloodGroup(row.bloodGroup ?? row.blood);
  const place = String(row.place ?? "").trim();
  const phone = String(row.phone ?? row.phoneNo ?? row["phone no"] ?? "").trim();
  const age = Number(row.age);
  if (!name || !phone || !place || !bloodGroup) return null;
  return {
    id: String(row.id ?? createId()),
    name,
    age: Number.isInteger(age) ? age : 0,
    phone,
    bloodGroup,
    place,
    consent:
      row.consent !== false &&
      String(row.consent ?? "true").toLowerCase() !== "no",
    availability: String(row.availability ?? "Available").trim() || "Available",
    createdAt: String(row.createdAt ?? new Date().toISOString()),
  };
}

function mergeById<T extends { id: string }>(stored: T[], seeds: T[]): T[] {
  const ids = new Set(stored.map((item) => item.id));
  return [...stored, ...seeds.filter((item) => !ids.has(item.id))];
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key) ?? "";
    const cached = cache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    if (!raw) {
      cache.set(key, { raw, value: fallback });
      return fallback;
    }
    const parsed = JSON.parse(raw) as unknown;
    let value: T;
    if (key === DONORS_KEY && Array.isArray(parsed)) {
      const stored = parsed.map(normalizeDonor).filter(Boolean) as Donor[];
      value = mergeById(stored, seedDonors) as T;
    } else if (key === REQUESTS_KEY && Array.isArray(parsed)) {
      value = mergeById(parsed as BloodRequest[], seedRequests) as T;
    } else {
      value = parsed as T;
    }
    cache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
    cache.set(key, { raw, value });
    notify();
  } catch {
    notify();
  }
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());
}

export function getDonors(): Donor[] {
  if (donorsSnapshot) return donorsSnapshot;
  const storedDonors = read<Donor[]>(DONORS_KEY, []);
  const byPhone = new Map<string, Donor>();

  for (const donor of [...storedDonors, ...seedDonors]) {
    const key = donor.phone.replace(/\D/g, "");
    if (key && !byPhone.has(key)) {
      byPhone.set(key, donor);
    }
  }

  donorsSnapshot = [...byPhone.values()];
  return donorsSnapshot;
}

function normalizeConnection(value: unknown): DonorConnection | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const requestId = String(row.requestId ?? "").trim();
  const donorId = String(row.donorId ?? "").trim();
  if (!requestId || !donorId) return null;
  return {
    requestId,
    donorId,
    donorName: String(row.donorName ?? "Donor"),
    donorPhone: String(row.donorPhone ?? ""),
    connectedAt: String(row.connectedAt ?? new Date().toISOString()),
  };
}

export function getConnections(): DonorConnection[] {
  if (connectionsSnapshot) return connectionsSnapshot;
  const stored = read<unknown[]>(CONNECTIONS_KEY, []);
  connectionsSnapshot = Array.isArray(stored)
    ? stored.map(normalizeConnection).filter((item): item is DonorConnection => !!item)
    : [];
  return connectionsSnapshot;
}

export function connectDonorToRequest(requestId: string, donor: Donor): void {
  const connection: DonorConnection = {
    requestId,
    donorId: donor.id,
    donorName: donor.name,
    donorPhone: donor.phone,
    connectedAt: new Date().toISOString(),
  };
  write(CONNECTIONS_KEY, [
    connection,
    ...getConnections().filter((item) => item.requestId !== requestId),
  ]);
}

export function disconnectDonorFromRequest(requestId: string): void {
  write(
    CONNECTIONS_KEY,
    getConnections().filter((item) => item.requestId !== requestId),
  );
}

export function useConnections(): DonorConnection[] {
  return useSyncExternalStore(subscribe, getConnections, () => emptyConnections);
}

export async function syncDonorToSheet(
  donor: Donor,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/donors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...donor,
        phoneNo: donor.phone,
        consent: donor.consent ? "Yes" : "No",
      }),
    });
    const result = (await response.json()) as {
      success?: boolean;
      message?: string;
    };
    return {
      success: result.success === true,
      message: result.message,
    };
  } catch {
    return { success: false, message: "Unable to sync donor to Google Sheet." };
  }
}

export function addDonor(
  input: Omit<Donor, "id" | "createdAt" | "consent" | "availability"> & {
    consent?: boolean;
    availability?: string;
  },
): { ok: true; donor: Donor } | { ok: false; message: string } {
  const donors = getDonors();
  const phone = input.phone.replace(/\D/g, "");
  if (
    donors.some(
      (donor) => donor.phone.replace(/\D/g, "") === phone && phone.length > 0,
    )
  ) {
    return { ok: false, message: "This phone number is already registered." };
  }
  const donor: Donor = {
    ...input,
    consent: input.consent ?? true,
    availability: input.availability ?? "Available",
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  write(DONORS_KEY, [donor, ...donors]);
  void syncDonorToSheet(donor);
  return { ok: true, donor };
}

export function getRequests(): BloodRequest[] {
  if (requestsSnapshot) return requestsSnapshot;
  requestsSnapshot = read(REQUESTS_KEY, seedRequests);
  return requestsSnapshot;
}

export function addRequest(
  input: Omit<BloodRequest, "id" | "createdAt">,
): BloodRequest {
  const request: BloodRequest = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  write(REQUESTS_KEY, [request, ...getRequests()]);
  return request;
}

export function useDonors(): Donor[] {
  if (typeof window !== "undefined") void refreshDonorsFromSheet();
  return useSyncExternalStore(subscribe, getDonors, () => seedDonors);
}

export function useRequests(): BloodRequest[] {
  return useSyncExternalStore(subscribe, getRequests, () => seedRequests);
}

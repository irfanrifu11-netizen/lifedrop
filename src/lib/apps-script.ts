import { seedMenu } from "./data";
import type { ActionResult, CouponResult, MenuItem } from "./types";

const SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbw6CeuaOowp_u4EtEd3OWEmLHXp2mXK2W9tJtMSnJkXMJM5msFofzKnXZDn0uOtHaapQw/exec";
const API_URL = SCRIPT_URL;
const WEB_URL = SCRIPT_URL;

type ScriptResponse = Record<string, unknown> | unknown[];

async function parseResponse(response: Response): Promise<ScriptResponse | null> {
  const text = await response.text();
  if (!text || text.trim().startsWith("<")) return null;
  try {
    return JSON.parse(text) as ScriptResponse;
  } catch {
    return null;
  }
}

async function postAction(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<ScriptResponse | null> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
      cache: "no-store",
    });
    return await parseResponse(response);
  } catch {
    return null;
  }
}

function asRecord(value: ScriptResponse | null): Record<string, unknown> {
  return value && !Array.isArray(value) ? value : {};
}

function normalizeItems(value: ScriptResponse | null): MenuItem[] {
  if (!value) return [];
  const record = asRecord(value);
  const raw = Array.isArray(value)
    ? value
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.data)
        ? record.data
        : [];

  return raw
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Record<string, unknown>;
      const name = String(row.name ?? row.item ?? "").trim();
      if (!name) return null;
      return {
        id: Number(row.id ?? index + 1),
        name,
        price: Number(row.price ?? 0),
        stock: Number(row.stock ?? 0),
        image: String(row.image ?? ""),
        category: (String(row.category ?? "General") as MenuItem["category"]),
        description: String(row.description ?? "Freshly prepared for you."),
      } satisfies MenuItem;
    })
    .filter((item): item is MenuItem => item !== null);
}

export async function getRemoteItems(): Promise<MenuItem[]> {
  const posted = normalizeItems(await postAction("items"));
  if (posted.length) return posted;

  try {
    const response = await fetch(`${WEB_URL}?action=items`, {
      cache: "no-store",
    });
    const items = normalizeItems(await parseResponse(response));
    if (items.length) return items;
  } catch {
    return seedMenu;
  }

  return seedMenu;
}

export async function addRemoteItem(data: {
  name: string;
  price: number;
  stock: number;
  image: string;
}): Promise<ActionResult> {
  const result = asRecord(await postAction("addItem", data));
  return {
    success: result.success === true,
    message: String(result.message ?? "Unable to add item."),
    id: Number(result.id ?? 0) || undefined,
  };
}

export async function addRemoteOrder(data: Record<string, unknown>): Promise<ActionResult> {
  const result = asRecord(await postAction("addOrder", data));
  return {
    success: result.success === true,
    message: String(result.message ?? "Unable to sync order."),
    row: Number(result.row ?? result.id ?? 0) || undefined,
  };
}

export async function applyRemoteCoupon(
  code: string,
  total: number,
): Promise<CouponResult> {
  const result = asRecord(await postAction("applyCoupon", { code, total }));
  const discount = Number(result.discount);
  const finalTotal = Number(result.finalTotal);
  return {
    success: result.success === true,
    message: String(result.message ?? "Unable to apply coupon."),
    discount: Number.isFinite(discount) ? discount : undefined,
    finalTotal: Number.isFinite(finalTotal) ? finalTotal : undefined,
  };
}

export async function updateRemoteOrder(
  field: "status" | "paymentStatus",
  row: number,
  value: string,
): Promise<ActionResult> {
  const action = field === "status" ? "updateStatus" : "updatePaymentStatus";
  const payload =
    field === "status"
      ? { row, status: value }
      : { row, paymentStatus: value };
  const result = asRecord(await postAction(action, payload));
  return {
    success: result.success === true,
    message: String(result.message ?? "Unable to update order."),
  };
}

export async function getRemoteDonors(): Promise<Record<string, unknown>[]> {
  const normalize = (value: ScriptResponse | null) => {
    if (!value) return [];
    const record = asRecord(value);
    const raw = Array.isArray(value)
      ? value
      : Array.isArray(record.donors)
        ? record.donors
        : Array.isArray(record.data)
          ? record.data
          : [];
    return raw.filter(
      (entry): entry is Record<string, unknown> =>
        !!entry && typeof entry === "object",
    );
  };

  try {
    const response = await fetch(`${WEB_URL}?action=getDonors`, {
      cache: "no-store",
    });
    const donors = normalize(await parseResponse(response));
    if (donors.length) return donors;
  } catch {
    // Fall through to POST action for older deployments.
  }

  return normalize(await postAction("getDonors"));
}

export async function addRemoteDonor(data: Record<string, unknown>): Promise<ActionResult> {
  const payload = {
    ...data,
    blood: String(data.blood ?? data.bloodGroup ?? ""),
    phone: String(data.phone ?? data.phoneNo ?? ""),
  };
  const result = asRecord(await postAction("registerDonor", payload));
  if (result.success === true) {
    return {
      success: true,
      message: String(result.message ?? "Donor synced."),
      row: Number(result.row ?? result.id ?? 0) || undefined,
    };
  }

  const fallback = asRecord(await postAction("addDonor", data));
  return {
    success: fallback.success === true,
    message: String(
      fallback.message ?? fallback.error ?? result.error ?? result.message ?? "Unable to sync donor.",
    ),
    row: Number(fallback.row ?? fallback.id ?? 0) || undefined,
  };
}

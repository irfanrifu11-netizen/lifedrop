"use client";

import { useSyncExternalStore } from "react";

const KEYS = {
  cart: "saffron.cart.v1",
  items: "saffron.items.v1",
  orders: "saffron.orders.v1",
  reservations: "saffron.reservations.v1",
  admin: "saffron.admin.v1",
  welcome10Used: "saffron.welcome10.used.v1",
} as const;

export const ADMIN_PASSWORD = "admin@123";

type Listener = () => void;
type CacheEntry = { raw: string; value: unknown };

const listeners = new Set<Listener>();
const cache = new Map<string, CacheEntry>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeLocalStore(listener: Listener) {
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
    const value = JSON.parse(raw) as T;
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
    return;
  }
}

export function useLocalValue<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    subscribeLocalStore,
    () => read(key, fallback),
    () => fallback,
  );
}

export const localStore = {
  keys: KEYS,
  getCart: <T,>(fallback: T) => read(KEYS.cart, fallback),
  setCart: <T,>(value: T) => write(KEYS.cart, value),
  getItems: <T,>(fallback: T) => read(KEYS.items, fallback),
  setItems: <T,>(value: T) => write(KEYS.items, value),
  getOrders: <T,>(fallback: T) => read(KEYS.orders, fallback),
  setOrders: <T,>(value: T) => write(KEYS.orders, value),
  getReservations: <T,>(fallback: T) => read(KEYS.reservations, fallback),
  setReservations: <T,>(value: T) => write(KEYS.reservations, value),
  isAdmin: () => read(KEYS.admin, false),
  setAdmin: (value: boolean) => write(KEYS.admin, value),
  isWelcome10Used: () => read(KEYS.welcome10Used, false),
  setWelcome10Used: (value: boolean) => write(KEYS.welcome10Used, value),
};

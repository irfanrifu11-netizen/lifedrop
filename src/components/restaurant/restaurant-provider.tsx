"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedMenu } from "@/lib/data";
import { localStore, useLocalValue } from "@/lib/local-store";
import type {
  CartLine,
  MenuItem,
  NewOrder,
  NewReservation,
  Order,
  Reservation,
} from "@/lib/types";

type StoredCartLine = { itemId: number; quantity: number };

type RestaurantContextValue = {
  items: MenuItem[];
  itemsLoading: boolean;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem) => void;
  setQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (data: NewOrder) => Order;
  updateOrder: (id: string, patch: Partial<Pick<Order, "status" | "paymentStatus">>) => void;
  reservations: Reservation[];
  addReservation: (data: NewReservation) => Reservation;
  updateReservation: (id: string, status: Reservation["status"]) => void;
  addMenuItem: (data: { name: string; price: number; stock: number; image: string }) => Promise<{ success: boolean; message: string }>;
  removeMenuItem: (id: number) => Promise<{ success: boolean; message: string }>;
  notice: string;
  setNotice: (message: string) => void;
};

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(seedMenu);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const storedCart = useLocalValue<StoredCartLine[]>(localStore.keys.cart, []);
  const orders = useLocalValue<Order[]>(localStore.keys.orders, []);
  const reservations = useLocalValue<Reservation[]>(
    localStore.keys.reservations,
    [],
  );

  useEffect(() => {
    const localItems = localStore.getItems<MenuItem[]>([]);
    const removedIds = new Set(localStore.getRemovedItems<number[]>([]));
    const merge = (remote: MenuItem[]) => {
      const byId = new Map(remote.map((item) => [item.id, item]));
      localItems.forEach((item) => byId.set(item.id, item));
      setItems(
        Array.from(byId.values()).filter((item) => !removedIds.has(item.id)),
      );
    };

    fetch("/api/items", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { items?: MenuItem[] }) => {
        merge(Array.isArray(data.items) ? data.items : seedMenu);
      })
      .catch(() => merge(seedMenu))
      .finally(() => setItemsLoading(false));
  }, []);

  const cart = useMemo<CartLine[]>(() => {
    return storedCart
      .map((line) => {
        const item = items.find((entry) => entry.id === line.itemId);
        return item ? { item, quantity: line.quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
  }, [storedCart, items]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );

  const addToCart = useCallback(
    (item: MenuItem) => {
      if (item.stock <= 0) {
        setNotice(`${item.name} is out of stock.`);
        return;
      }
      const existing = storedCart.find((line) => line.itemId === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          setNotice(`Only ${item.stock} available for ${item.name}.`);
          return;
        }
        localStore.setCart(
          storedCart.map((line) =>
            line.itemId === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        );
        setNotice(`${item.name} quantity updated.`);
      } else {
        localStore.setCart([
          ...storedCart,
          { itemId: item.id, quantity: 1 },
        ]);
        setNotice(`${item.name} added to cart.`);
      }
      setCartOpen(true);
    },
    [storedCart],
  );

  const setQuantity = useCallback(
    (itemId: number, quantity: number) => {
      localStore.setCart(
        quantity <= 0
          ? storedCart.filter((line) => line.itemId !== itemId)
          : storedCart.map((line) =>
              line.itemId === itemId ? { ...line, quantity } : line,
            ),
      );
    },
    [storedCart],
  );

  const removeFromCart = useCallback(
    (itemId: number) => {
      localStore.setCart(
        storedCart.filter((line) => line.itemId !== itemId),
      );
    },
    [storedCart],
  );

  const clearCart = useCallback(() => localStore.setCart([]), []);

  const placeOrder = useCallback(
    (data: NewOrder) => {
      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        customerName: data.customerName,
        phone: data.phone,
        items: data.items,
        total: data.total,
        fulfilment: data.fulfilment,
        address: data.address,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        status: "Pending",
        paymentStatus: "Unpaid",
        synced: false,
      };

      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, orderId: order.id }),
      })
        .then((response) => response.json())
        .then((result: { success?: boolean; row?: number }) => {
          if (!result.success || !result.row) return;
          const current = localStore.getOrders<Order[]>([]);
          localStore.setOrders(
            current.map((entry) =>
              entry.id === order.id
                ? { ...entry, row: result.row, synced: true }
                : entry,
            ),
          );
        })
        .catch(() => undefined);

      localStore.setOrders([order, ...orders]);
      localStore.setCart([]);
      return order;
    },
    [orders],
  );

  const updateOrder = useCallback(
    (id: string, patch: Partial<Pick<Order, "status" | "paymentStatus">>) => {
      const existing = orders.find((entry) => entry.id === id);
      localStore.setOrders(
        orders.map((entry) =>
          entry.id === id ? { ...entry, ...patch } : entry,
        ),
      );

      if (!existing?.row) return;
      if (patch.status) {
        fetch("/api/orders/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ row: existing.row, status: patch.status }),
        }).catch(() => undefined);
      }
      if (patch.paymentStatus) {
        fetch("/api/orders/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            row: existing.row,
            paymentStatus: patch.paymentStatus,
          }),
        }).catch(() => undefined);
      }
    },
    [orders],
  );

  const addReservation = useCallback(
    (data: NewReservation) => {
      const reservation: Reservation = {
        id: `RES-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        ...data,
        status: "Pending",
      };
      localStore.setReservations([reservation, ...reservations]);
      return reservation;
    },
    [reservations],
  );

  const updateReservation = useCallback(
    (id: string, status: Reservation["status"]) => {
      localStore.setReservations(
        reservations.map((entry) =>
          entry.id === id ? { ...entry, status } : entry,
        ),
      );
    },
    [reservations],
  );

  const addMenuItem = useCallback(
    async (data: { name: string; price: number; stock: number; image: string }) => {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        id?: number;
      };
      const id = result.id || Math.max(0, ...items.map((item) => item.id)) + 1;
      const item: MenuItem = {
        id,
        name: data.name,
        price: data.price,
        stock: data.stock,
        image: data.image,
        category: "General",
        description: "Added from the admin panel.",
      };
      const updated = [...items.filter((entry) => entry.id !== id), item];
      localStore.setItems(updated);
      localStore.setRemovedItems(
        localStore.getRemovedItems<number[]>([]).filter((entry) => entry !== id),
      );
      setItems(updated);
      return {
        success: result.success === true,
        message:
          result.message ??
          (result.success
            ? "Item saved to Apps Script and this browser."
            : "Item saved in this browser only."),
      };
    },
    [items],
  );

  const removeMenuItem = useCallback(
    async (id: number) => {
      let result: { success?: boolean; message?: string } = {};
      try {
        const response = await fetch(`/api/items?id=${id}`, {
          method: "DELETE",
        });
        result = (await response.json()) as {
          success?: boolean;
          message?: string;
        };
      } catch {
        result = {};
      }

      const updated = items.filter((entry) => entry.id !== id);
      localStore.setItems(updated);
      localStore.setRemovedItems([
        ...new Set([...localStore.getRemovedItems<number[]>([]), id]),
      ]);
      localStore.setCart(storedCart.filter((line) => line.itemId !== id));
      setItems(updated);
      return {
        success: result.success === true,
        message:
          result.message ??
          (result.success
            ? "Item removed from Apps Script and this browser."
            : "Item removed from this browser only."),
      };
    },
    [items, storedCart],
  );

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const value: RestaurantContextValue = {
    items,
    itemsLoading,
    cart,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    orders,
    placeOrder,
    updateOrder,
    reservations,
    addReservation,
    updateReservation,
    addMenuItem,
    removeMenuItem,
    notice,
    setNotice,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used inside RestaurantProvider");
  }
  return context;
}

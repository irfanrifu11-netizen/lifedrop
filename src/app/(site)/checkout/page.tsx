"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BadgePercent,
  MapPin,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useRestaurant } from "@/components/restaurant/restaurant-provider";
import { localStore } from "@/lib/local-store";

const paymentMethods = ["Cash on delivery", "UPI", "Card", "Pay at counter"];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, placeOrder } = useRestaurant();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfilment, setFulfilment] = useState<"Pickup" | "Delivery">("Pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = fulfilment === "Delivery" ? 30 : 0;
  const orderSubtotal = cartTotal + deliveryFee;
  const discount = appliedCoupon
    ? Math.min(appliedCoupon.discount, orderSubtotal)
    : 0;
  const total = Math.max(0, orderSubtotal - discount);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    if (orderSubtotal <= 0) {
      setCouponError("Add items to your cart before applying a coupon.");
      return;
    }
    if (code === "WELCOME10" && localStore.isWelcome10Used()) {
      setAppliedCoupon(null);
      setCouponError("WELCOME10 has already been used and can no longer be applied.");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");
    try {
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          total: orderSubtotal,
          usedCodes: localStore.isWelcome10Used() ? ["WELCOME10"] : [],
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        discount?: number;
      };

      if (!result.success || typeof result.discount !== "number") {
        setAppliedCoupon(null);
        setCouponError(result.message ?? "Unable to apply coupon.");
        return;
      }

      setAppliedCoupon({
        code,
        discount: result.discount,
        message: result.message ?? "Coupon applied.",
      });
      setCouponCode(code);
    } catch {
      setAppliedCoupon(null);
      setCouponError("Unable to apply coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty. Add items before checking out.");
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (fulfilment === "Delivery" && !address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    const order = placeOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      items: cart.map(({ item, quantity }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      })),
      total,
      fulfilment,
      address: address.trim(),
      notes: notes.trim(),
      paymentMethod,
    });
    if (appliedCoupon?.code === "WELCOME10") {
      localStore.setWelcome10Used(true);
    }
    router.push(`/order-confirmation?id=${order.id}`);
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Link
        href="/#menu"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-secondary hover:text-primary"
      >
        <ArrowLeft size={15} />
        Back to menu
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
        Almost there
      </p>
      <h1 className="mt-2 font-display text-4xl text-on-surface sm:text-5xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <section className="rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-primary">
                <User size={17} />
              </span>
              <h2 className="font-display text-2xl text-on-surface">Your details</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                  Full name
                </span>
                <input
                  className={inputClass}
                  value={customerName}
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Ali Khan"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                  Phone number
                </span>
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. 9876543210"
                  inputMode="tel"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-primary">
                <MapPin size={17} />
              </span>
              <h2 className="font-display text-2xl text-on-surface">
                Fulfilment
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Pickup", "Delivery"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFulfilment(option);
                    if (appliedCoupon) {
                      setAppliedCoupon(null);
                      setCouponError("Coupon removed because fulfilment changed.");
                    }
                  }}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    fulfilment === option
                      ? "border-primary bg-primary-container"
                      : "border-outline hover:border-primary"
                  }`}
                >
                  <p className="text-sm font-semibold text-on-surface">{option}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {option === "Pickup"
                      ? "Collect at the counter"
                      : "Delivered to your door (+₹30)"}
                  </p>
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                {fulfilment === "Pickup"
                  ? "Table number or pickup note (optional)"
                  : "Delivery address"}
              </span>
              <input
                className={inputClass}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={
                  fulfilment === "Pickup" ? "e.g. Table 4" : "Street, area, landmark"
                }
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                Notes for the kitchen (optional)
              </span>
              <textarea
                className={`${inputClass} min-h-24 resize-none`}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="e.g. Less spicy, no onion"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-primary">
                <Phone size={17} />
              </span>
              <h2 className="font-display text-2xl text-on-surface">Payment</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                    paymentMethod === method
                      ? "border-primary bg-primary-container text-on-surface"
                      : "border-outline text-on-surface-variant hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-primary"
                  />
                  {method}
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-on-surface-variant">
              Payment is confirmed by our team. Your order starts as unpaid and
              can be marked paid from the admin dashboard.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-outline-variant bg-surface p-6 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-2">
            <ShoppingBag size={17} className="text-primary" />
            <h2 className="font-display text-xl text-on-surface">Order summary</h2>
          </div>
          <div className="mb-5 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <div className="mb-2 flex items-center gap-2">
              <BadgePercent size={15} className="text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Have a coupon?
              </p>
            </div>
            <div className="flex gap-2">
              <input
                className={`${inputClass} min-w-0 uppercase`}
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value.toUpperCase());
                  setCouponError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void applyCoupon();
                  }
                }}
                placeholder="Enter code"
                aria-label="Coupon code"
                disabled={Boolean(appliedCoupon)}
              />
              <button
                type="button"
                onClick={() => void applyCoupon()}
                disabled={applyingCoupon || Boolean(appliedCoupon)}
                className="shrink-0 rounded-xl bg-primary px-4 text-xs font-semibold uppercase tracking-widest text-on-primary transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applyingCoupon ? "..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-xs text-error">{couponError}</p>
            )}
            {appliedCoupon && (
              <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border border-primary/20 bg-primary-container p-3">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {appliedCoupon.code} applied
                  </p>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant">
                    {appliedCoupon.message} · ₹{discount} off
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-secondary/20 bg-secondary-container px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <BadgePercent size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {fulfilment === "Pickup" ? "Offer applied" : "Save with pickup"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {fulfilment === "Pickup"
                  ? "You're saving ₹30 on delivery."
                  : "Choose pickup and save ₹30 on delivery."}
              </p>
            </div>
          </div>
          {cart.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="text-on-surface-variant">
                    {quantity} × {item.name}
                  </span>
                  <span className="font-semibold text-on-surface">
                    ₹{item.price * quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 space-y-2 border-t border-outline-variant pt-5 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Delivery</span>
              <span>₹{deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Coupon discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-base font-bold text-on-surface">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          {error && <p className="mt-4 text-xs text-error">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-brand-dark"
          >
            Place order
          </button>
          <p className="mt-3 text-center text-[11px] text-on-surface-variant">
            You&apos;ll get an order ID to track your order.
          </p>
        </aside>
      </form>
    </div>
  );
}

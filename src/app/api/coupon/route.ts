import { NextResponse } from "next/server";
import { applyRemoteCoupon } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

const LOCAL_COUPONS: Record<
  string,
  { rate: number; message: string; singleUse?: boolean }
> = {
  BIGDEAL50: { rate: 0.5, message: "50% off applied." },
  WELCOME10: { rate: 0.1, message: "10% off applied.", singleUse: true },
};

export async function POST(request: Request) {
  let body: { code?: unknown; total?: unknown; usedCodes?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const code = String(body.code ?? "").trim().toUpperCase();
  const total = Number(body.total);

  if (!code || !Number.isFinite(total) || total <= 0) {
    return NextResponse.json(
      { success: false, message: "Enter a coupon code." },
      { status: 400 },
    );
  }

  const localCoupon = LOCAL_COUPONS[code];
  if (localCoupon) {
    const usedCodes = Array.isArray(body.usedCodes) ? body.usedCodes : [];
    if (localCoupon.singleUse && usedCodes.includes(code)) {
      return NextResponse.json({
        success: false,
        message: `${code} has already been used and can no longer be applied.`,
      });
    }

    const discount = Math.round(total * localCoupon.rate);
    return NextResponse.json({
      success: true,
      message: localCoupon.message,
      discount,
      finalTotal: total - discount,
    });
  }

  const result = await applyRemoteCoupon(code, total);
  return NextResponse.json(result);
}

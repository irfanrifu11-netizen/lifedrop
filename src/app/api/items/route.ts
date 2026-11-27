import { NextResponse } from "next/server";
import { addRemoteItem, deleteRemoteItem, getRemoteItems } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getRemoteItems();
  return NextResponse.json({ success: true, items });
}

export async function POST(request: Request) {
  let body: { name?: string; price?: number; stock?: number; image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock);
  const image = String(body.image ?? "");

  if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return NextResponse.json(
      { success: false, message: "Invalid item details." },
      { status: 400 },
    );
  }

  const result = await addRemoteItem({ name, price, stock, image });
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { success: false, message: "Invalid item id." },
      { status: 400 },
    );
  }

  const result = await deleteRemoteItem(id);
  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { addRemoteDonor, getRemoteDonors } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

export async function GET() {
  const donors = await getRemoteDonors();
  return NextResponse.json({ success: true, donors });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const age = Number(body.age);
  const phone = String(body.phone ?? "").trim();
  const bloodGroup = String(body.bloodGroup ?? "").trim();
  const place = String(body.place ?? "").trim();

  if (
    !name ||
    !Number.isInteger(age) ||
    age < 18 ||
    age > 65 ||
    !phone ||
    !bloodGroup ||
    !place
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid donor details." },
      { status: 400 },
    );
  }

  const consentValue = body.consent;
  const consent =
    consentValue === true || String(consentValue).toLowerCase() === "yes"
      ? "Yes"
      : "No";
  const availability = String(body.availability ?? "Available").trim() || "Available";

  const result = await addRemoteDonor({
    name,
    age,
    phone,
    phoneNo: phone,
    bloodGroup,
    place,
    consent,
    availability,
    createdAt: String(body.createdAt ?? new Date().toISOString()),
  });

  return NextResponse.json(result);
}

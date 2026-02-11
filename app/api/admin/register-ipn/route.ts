import { NextResponse } from "next/server";
import { getAuthToken, registerIPN } from "@/lib/pesapal";

export async function GET() {
  try {
    const token = await getAuthToken();
    const result = await registerIPN(token);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
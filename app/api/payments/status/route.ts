// app/api/payments/status/route.ts

import { NextResponse } from "next/server";
import { getAuthToken, getTransactionStatus } from "@/lib/pesapal";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderTrackingId = searchParams.get("orderTrackingId");

  if (!orderTrackingId) return NextResponse.json({ error: "No ID" }, { status: 400 });

  try {
    const token = await getAuthToken();
    const statusData = await getTransactionStatus(token, orderTrackingId);
    
    // Pesapal Status 1 = Completed/Success
    const isPaid = statusData.payment_status_description === "Completed" || statusData.status_code === 1;

    if (isPaid) {
      const supabase = await createClient();
      await supabase
        .from("transactions")
        .update({ status: "COMPLETED" })
        .eq("pesapal_order_tracking_id", orderTrackingId);
    }

    return NextResponse.json({ 
      status: statusData.payment_status_description,
      isPaid 
    });
  } catch (error) {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
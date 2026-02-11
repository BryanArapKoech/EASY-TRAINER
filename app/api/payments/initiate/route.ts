// app/api/payments/initiate/route.ts
import { NextResponse } from "next/server";
import { getAuthToken, submitOrder } from "@/lib/pesapal";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { phone, unitCode, docType } = await req.json();
    const supabase = await createClient();
    const token = await getAuthToken();

    // 1. Create a unique reference
    const merchantReference = `ET-${Math.floor(Math.random() * 1000000)}`;

    // 2. Save PENDING transaction to Supabase
    const { error: dbError } = await supabase.from('transactions').insert({
      phone_number: phone,
      unit_code: unitCode,
      doc_type: docType,
      merchant_reference: merchantReference,
      amount: 25.00, // You can calculate this based on the unit if needed
    });

    if (dbError) throw dbError;

    // 3. Request Pesapal Payment
    const orderRequest = {
      id: merchantReference,
      currency: "KES",
      amount: 25.00,
      description: `Payment for ${docType}: ${unitCode}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-payment`,
      notification_id: "YOUR_IPN_ID_HERE", // We will get this in a moment
      billing_address: {
        phone_number: phone,
        email_address: "guest@easytrainer.co.ke", // Pesapal requires an email
        first_name: "Trainer",
        last_name: "Guest"
      }
    };

    const result = await submitOrder(token, orderRequest);

    return NextResponse.json({ redirect_url: result.redirect_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
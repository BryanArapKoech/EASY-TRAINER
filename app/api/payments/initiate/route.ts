import { NextResponse } from "next/server";
import { getAuthToken, submitOrder } from "@/lib/pesapal";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { phone, unitCode, docType } = await req.json();
    const supabase = await createClient();
    const token = await getAuthToken();

    const merchantReference = `ET-${Date.now()}`;

    // 1. Save PENDING transaction
    const { error: dbError } = await supabase.from('transactions').insert({
      phone_number: phone,
      unit_code: unitCode,
      doc_type: docType,
      merchant_reference: merchantReference,
      amount: 25.00, 
    });

    if (dbError) throw dbError;

    // 2. Request Pesapal Payment
    const orderRequest = {
      id: merchantReference,
      currency: "KES",
      amount: 25.00,
      description: `Easy Trainer Document: ${docType}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-payment`,
      notification_id: process.env.PESAPAL_IPN_ID, 
      billing_address: {
        phone_number: phone,
        email_address: "guest@easytrainer.co.ke",
        first_name: "Trainer",
        last_name: "Customer"
      }
    };

    const result = await submitOrder(token, orderRequest);

    // 3. Update the record with tracking ID
    await supabase
      .from('transactions')
      .update({ pesapal_order_tracking_id: result.order_tracking_id })
      .eq('merchant_reference', merchantReference);

    return NextResponse.json({ redirect_url: result.redirect_url });
  } catch (err: any) {
    console.error("Initiate Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
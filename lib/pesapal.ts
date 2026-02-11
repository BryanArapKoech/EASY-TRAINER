// lib/pesapal.ts

const PESAPAL_URL = process.env.PESAPAL_URL; // https://pay.pesapal.com/v3
const KEY = process.env.PESAPAL_CONSUMER_KEY;
const SECRET = process.env.PESAPAL_CONSUMER_SECRET;

// 1. Get Authentication Token
export async function getAuthToken() {
  const res = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ consumer_key: KEY, consumer_secret: SECRET }),
  });
  const data = await res.json();
  return data.token;
}

// 2. Register IPN (Instant Payment Notification) 
// You only need to do this once, but we'll make a helper for it.
export async function registerIPN(token: string) {
  const res = await fetch(`${PESAPAL_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json" 
    },
    body: JSON.stringify({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/pesapal`,
      ipn_notification_type: "GET"
    }),
  });
  return await res.json();
}

// 3. Submit Order
export async function submitOrder(token: string, orderData: any) {
  const res = await fetch(`${PESAPAL_URL}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json" 
    },
    body: JSON.stringify(orderData),
  });
  return await res.json();
}
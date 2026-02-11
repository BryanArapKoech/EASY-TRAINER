// lib/pesapal.ts

const PESAPAL_URL = process.env.PESAPAL_URL;
const KEY = process.env.PESAPAL_CONSUMER_KEY;
const SECRET = process.env.PESAPAL_CONSUMER_SECRET;

export async function getAuthToken() {
  const res = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ consumer_key: KEY, consumer_secret: SECRET }),
  });
  const data = await res.json();
  return data.token;
}

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
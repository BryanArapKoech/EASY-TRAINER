// lib/pesapal.ts

const PESAPAL_URL = process.env.PESAPAL_URL?.replace(/\/$/, ""); // Removes trailing slash if exists
const KEY = process.env.PESAPAL_CONSUMER_KEY;
const SECRET = process.env.PESAPAL_CONSUMER_SECRET;

export async function getAuthToken() {
  const res = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ consumer_key: KEY, consumer_secret: SECRET }),
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error("Auth Token Error Response:", text);
    throw new Error(`Pesapal Auth failed with status ${res.status}`);
  }

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

  if (!res.ok) {
    const text = await res.text();
    console.error("Register IPN Error Response:", text);
    throw new Error(`IPN Registration failed with status ${res.status}`);
  }

  return await res.json();
}
// ... submitOrder as is  for response.ok and error logging

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

// Add this to lib/pesapal.ts

export async function getTransactionStatus(token: string, orderTrackingId: string) {
  const res = await fetch(
    `${process.env.PESAPAL_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return await res.json();
}
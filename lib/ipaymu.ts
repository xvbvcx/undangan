import crypto from "crypto";

type RedirectPayload = {
  referenceId: string;
  amount: number;
  buyerName?: string;
  buyerEmail?: string;
  productName: string;
};

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function createIpaymuRedirect(payload: RedirectPayload) {
  const va = process.env.IPAYMU_VA;
  const apiKey = process.env.IPAYMU_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const isProd = process.env.IPAYMU_PRODUCTION === "true";

  if (!va || !apiKey) {
    throw new Error("IPAYMU_VA dan IPAYMU_API_KEY belum disetel.");
  }

  const endpoint = isProd ? "https://my.ipaymu.com/api/v2/payment" : "https://sandbox.ipaymu.com/api/v2/payment";
  const body = {
    product: [payload.productName],
    qty: ["1"],
    price: [String(payload.amount)],
    description: ["Paket Premium Ultra Exclusive Nikah Kilat"],
    amount: String(payload.amount),
    returnUrl: `${siteUrl}/payment/success?ref=${payload.referenceId}`,
    cancelUrl: `${siteUrl}/payment/cancel?ref=${payload.referenceId}`,
    notifyUrl: `${siteUrl}/api/payment/ipaymu/callback`,
    referenceId: payload.referenceId,
    buyerName: payload.buyerName || "Pelanggan Nikah Kilat",
    buyerEmail: payload.buyerEmail || "customer@nikahkilat.local"
  };

  const bodyHash = crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
  const stringToSign = `POST:${va}:${bodyHash}:${apiKey}`;
  const signature = crypto.createHmac("sha256", apiKey).update(stringToSign).digest("hex");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      va,
      signature,
      timestamp: timestamp()
    },
    body: JSON.stringify(body)
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.Message || json?.message || `iPaymu error ${response.status}`);
  }

  const paymentUrl = json?.Data?.Url || json?.Data?.url || json?.Url || json?.url || json?.payment_url;
  return { raw: json, paymentUrl };
}

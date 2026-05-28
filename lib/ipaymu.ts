import crypto from "crypto";

export type IpaymuRedirectPayload = {
  referenceId: string;
  amount: number;
  buyerName?: string;
  buyerEmail?: string;
  productName: string;
};

export type IpaymuRedirectResult = {
  raw: Record<string, unknown>;
  paymentUrl: string | undefined;
};

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function ipaymuConfig() {
  const va = process.env.IPAYMU_VA;
  const apiKey = process.env.IPAYMU_API_KEY;
  const isProd = process.env.IPAYMU_PRODUCTION === "true";
  if (!va || !apiKey) throw new Error("IPAYMU_VA dan IPAYMU_API_KEY belum disetel.");
  const baseUrl = isProd ? "https://my.ipaymu.com" : "https://sandbox.ipaymu.com";
  return { va, apiKey, baseUrl };
}

function signBody(method: "POST" | "GET", body: string, va: string, apiKey: string) {
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex").toLowerCase();
  const stringToSign = `${method}:${va}:${bodyHash}:${apiKey}`;
  return crypto.createHmac("sha256", apiKey).update(stringToSign).digest("hex");
}

export async function createIpaymuRedirect(payload: IpaymuRedirectPayload): Promise<IpaymuRedirectResult> {
  const { va, apiKey, baseUrl } = ipaymuConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/v2/payment`;

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

  const serialized = JSON.stringify(body);
  const signature = signBody("POST", serialized, va, apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      va,
      signature,
      timestamp: timestamp()
    },
    body: serialized
  });

  const json = (await response.json().catch(() => ({}))) as Record<string, any>;
  if (!response.ok) {
    throw new Error(json?.Message || json?.message || `iPaymu error ${response.status}`);
  }

  const data = (json?.Data ?? {}) as Record<string, any>;
  const paymentUrl =
    data?.Url || data?.url || (json as any)?.Url || (json as any)?.url || (json as any)?.payment_url;

  return { raw: json, paymentUrl };
}

// Verifies the callback request really comes from iPaymu by checking the
// `signature` header against the same HMAC scheme used for outbound calls.
// Falls back to "false" (untrusted) when the configuration or header is absent.
export function verifyIpaymuSignature(rawBody: string, headerSignature: string | null): boolean {
  if (!headerSignature) return false;
  try {
    const { va, apiKey } = ipaymuConfig();
    const expected = signBody("POST", rawBody, va, apiKey);
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(headerSignature, "hex");
    if (a.length === 0 || a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Server-to-server confirmation. Even when the callback signature checks out,
// always confirm the transaction with iPaymu before flipping the order to paid.
export type IpaymuTransactionInfo = {
  status: string | null;
  amount: number | null;
  raw: Record<string, unknown>;
};

export async function fetchIpaymuTransaction(referenceId: string): Promise<IpaymuTransactionInfo | null> {
  try {
    const { va, apiKey, baseUrl } = ipaymuConfig();
    const endpoint = `${baseUrl}/api/v2/transaction`;
    const body = { transactionId: referenceId };
    const serialized = JSON.stringify(body);
    const signature = signBody("POST", serialized, va, apiKey);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        va,
        signature,
        timestamp: timestamp()
      },
      body: serialized
    });

    if (!response.ok) return null;
    const json = (await response.json().catch(() => ({}))) as Record<string, any>;
    const data = (json?.Data ?? json) as Record<string, any>;
    const statusRaw = (data?.Status ?? data?.status ?? data?.StatusDesc ?? "").toString().toLowerCase();
    const amountRaw = data?.Amount ?? data?.amount ?? null;
    const amount = amountRaw == null ? null : Number(amountRaw);
    return { status: statusRaw || null, amount: Number.isFinite(amount) ? amount : null, raw: json };
  } catch {
    return null;
  }
}

const PAID_STATUS_KEYWORDS = ["paid", "berhasil", "success", "settlement", "settled"];

export function isIpaymuStatusPaid(status: string | null | undefined, code?: string | null): boolean {
  if (!status && !code) return false;
  const normalized = (status ?? "").toString().toLowerCase();
  if (code && (code === "1" || code === "berhasil")) return true;
  return PAID_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

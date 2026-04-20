import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Parse service tidak dikonfigurasi" },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "text tidak boleh kosong" },
        { status: 400 },
      );
    }

    const prompt = `
Extract this receipt into JSON.

Receipt text:
${text}

IMPORTANT:
- Each item MUST have a name (string)
- Do NOT return items without a name
- Extract item name from text before price
- If unsure, still generate a short name from the line

Rules:
- ONLY return valid JSON
- No explanation, no markdown
- All prices must be numbers
- Date format must be YYYY-MM-DD if possible
- If missing value, use null
- Qty default = 1
- Each item MUST have a name
- Extract item name from text BEFORE the price
- Do NOT return items with empty name
- If name unclear, generate a short label from the text
- Category must be one of:
  ["Food & Drink", "Transport", "Shopping", "Health", "Entertainment", "Bills", "Groceries", "Others"]

Format:
{
  "merchant": string | null,
  "date": string | null,
  "category": string | null,
  "items": [{ "name": string, "qty": number, "price": number }],
  "subtotal": number | null,
  "tax": number | null,
  "total": number | null
}
`.trim();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a receipt parser. Always return ONLY valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.error?.message },
        { status: res.status },
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "Respons AI kosong" }, { status: 422 });
    }

    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "JSON tidak valid", raw: cleaned },
        { status: 422 },
      );
    }

    console.log("RAW AI:", raw);
    console.log("PARSED:", parsed);

    // ✅ POST-PROCESSING (PENTING BANGET)
    const result = {
      merchant: parsed.merchant || "Unknown",
      date: parsed.date || null,
      category: parsed.category || null,
      total: Number(parsed.total) || 0,
      subtotal: Number(parsed.subtotal) || 0,
      tax: Number(parsed.tax) || 0,
      items:
        parsed.items
          ?.map((i: any) => ({
            name: i.name || i.item || i.description || i.product || "",
            qty: Number(i.qty) || 1,
            price: Number(i.price) || 0,
          }))
          .filter((i: any) => i.name || i.price > 0) || [],
    };

    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Parse error" },
      { status: 500 },
    );
  }
}

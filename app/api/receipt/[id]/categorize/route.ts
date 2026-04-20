import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const { id } = await context.params;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    // =========================
    // AUTH
    // =========================
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // =========================
    // GET RECEIPT
    // =========================
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .select("*, receipt_items(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (receiptError) {
      return NextResponse.json(
        { error: receiptError.message },
        { status: 500 },
      );
    }

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt tidak ditemukan" },
        { status: 404 },
      );
    }

    // =========================
    // GET CATEGORIES
    // =========================
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*");

    if (catError) {
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json({ error: "Categories kosong" }, { status: 400 });
    }

    // =========================
    // CALL PARSE API
    // =========================
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const parseRes = await fetch(`${baseUrl}/api/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Merchant: ${receipt.merchant_name}
Items: ${receipt.receipt_items?.map((i: any) => i.item_name).join(", ")}`,
      }),
    });

    if (!parseRes.ok) {
      const text = await parseRes.text();
      console.error("❌ Parse API error FULL:", text);

      return NextResponse.json(
        { error: "Parse API gagal", detail: text },
        { status: 500 },
      );
    }

    const { result } = await parseRes.json();

    console.log("AI RESULT:", result);

    if (!result?.category) {
      return NextResponse.json(
        { error: "AI tidak mengembalikan kategori" },
        { status: 400 },
      );
    }

    // =========================
    // NORMALIZE CATEGORY (SUPER IMPORTANT)
    // =========================
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, "");

    const aiCategory = normalize(result.category);

    // mapping fleksibel
    const matchedCategory = categories.find((c) => {
      const dbName = normalize(c.name);
      return aiCategory.includes(dbName) || dbName.includes(aiCategory);
    });

    console.log("AI Category:", result.category);
    console.log("Matched Category:", matchedCategory?.name);

    // =========================
    // UPDATE RECEIPT
    // =========================
    const { data: updated, error: updateError } = await supabase
      .from("receipts")
      .update({
        category_id: matchedCategory?.id ?? receipt.category_id,
      })
      .eq("id", id)
      .select("*, categories(*), receipt_items(*)")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ai_category: result.category,
      matched_category: matchedCategory?.name ?? null,
      receipt: updated,
    });
  } catch (err: any) {
    console.error("Categorize error:", err);

    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 },
    );
  }
}

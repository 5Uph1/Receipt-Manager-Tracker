import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

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
    const body = await req.json();

    const {
      imageUrl,
      merchant,
      date,
      total,
      notes,
      items = [],
      category,
    } = body;

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
    // VALIDATION
    // =========================
    if (!imageUrl) throw new Error("imageUrl wajib");
    if (!date) throw new Error("tanggal wajib");
    if (total === null || total === undefined) {
      throw new Error("total wajib");
    }

    // =========================
    // CATEGORY
    // =========================
    const allowedCategories = [
      "Food & Drink",
      "Transport",
      "Shopping",
      "Health",
      "Entertainment",
      "Bills",
      "Groceries",
      "Others",
    ];

    const categoryName = allowedCategories.includes(category)
      ? category
      : "Others";

    const { data: foundCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", categoryName)
      .maybeSingle();

    const categoryId = foundCategory?.id ?? null;

    // =========================
    // INSERT RECEIPT
    // =========================
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        merchant_name: merchant || "Unknown",
        receipt_date: date,
        total_amount: total,
        notes: notes || null,
        category_id: categoryId,
        ocr_data: {
          items,
          merchant,
          date,
          total,
          category,
        },
      })
      .select()
      .single();

    if (receiptError) throw receiptError;

    // =========================
    // INSERT ITEMS
    // =========================
    let insertedItems: any[] = [];

    if (items.length > 0) {
      const cleanItems = items
        .filter((item: any) => item.item_name && item.price)
        .map((item: any) => ({
          receipt_id: receipt.id,
          item_name: item.item_name,
          price: Number(item.price) || 0,
          qty: Number(item.qty) || 1,
        }));

      if (cleanItems.length > 0) {
        const { data: itemsData, error: itemError } = await supabase
          .from("receipt_items")
          .insert(cleanItems)
          .select();

        if (itemError) throw itemError;

        insertedItems = itemsData;
      }
    }

    // =========================
    // FINAL RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      receipt: {
        ...receipt,
        receipt_items: insertedItems,
      },
    });
  } catch (err: any) {
    console.error("POST /receipt error:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

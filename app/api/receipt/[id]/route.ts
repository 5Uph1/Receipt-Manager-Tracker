import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// =========================
// PATCH - UPDATE RECEIPT + ITEMS
// =========================
export async function PATCH(
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

  // =========================
  // AUTH CHECK
  // =========================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // pisahkan items
    const { items, ...receiptData } = body;

    // =========================
    // VALIDASI OWNERSHIP
    // =========================
    const { data: existingReceipt, error: checkError } = await supabase
      .from("receipts")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingReceipt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // =========================
    // CLEAN ITEMS
    // =========================
    const cleanItems = items?.filter(
      (item: any) => item.item_name && item.price > 0,
    );

    // =========================
    // HITUNG TOTAL DARI ITEMS
    // =========================
    const totalAmount =
      cleanItems?.reduce(
        (sum: number, item: any) => sum + item.price * (item.qty || 1),
        0,
      ) || 0;

    receiptData.total_amount = totalAmount;

    // =========================
    // UPDATE RECEIPT
    // =========================
    const { error: receiptError } = await supabase
      .from("receipts")
      .update(receiptData)
      .eq("id", id);

    if (receiptError) throw receiptError;

    // =========================
    // DELETE OLD ITEMS
    // =========================
    const { error: deleteError } = await supabase
      .from("receipt_items")
      .delete()
      .eq("receipt_id", id);

    if (deleteError) throw deleteError;

    // =========================
    // INSERT NEW ITEMS
    // =========================
    if (cleanItems?.length) {
      const newItems = cleanItems.map((item: any) => ({
        receipt_id: id,
        item_name: item.item_name,
        price: item.price,
        qty: item.qty || 1,
      }));

      const { error: insertError } = await supabase
        .from("receipt_items")
        .insert(newItems);

      if (insertError) throw insertError;
    }

    // =========================
    // FETCH UPDATED DATA
    // =========================
    const { data: receipt, error: fetchError } = await supabase
      .from("receipts")
      .select(
        `
        *,
        categories(*),
        receipt_items(*)
      `,
      )
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json({ receipt });
  } catch (err: any) {
    console.error("PATCH /receipt error:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

// =========================
// DELETE - DELETE RECEIPT
// =========================
export async function DELETE(
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

  // =========================
  // AUTH CHECK
  // =========================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // validasi ownership
    const { data: existingReceipt } = await supabase
      .from("receipts")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingReceipt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // delete items dulu (kalau belum cascade di DB)
    await supabase.from("receipt_items").delete().eq("receipt_id", id);

    // delete receipt
    const { error } = await supabase.from("receipts").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /receipt error:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

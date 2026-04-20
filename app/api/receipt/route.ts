import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(req.url);

  // ── FILTER PARAMS ─────────────────────────────
  const categoryId = searchParams.get("category_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const search = searchParams.get("search");
  const cleanSearch = search?.trim();
  const sort = searchParams.get("sort") || "newest";

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

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
  // AUTH
  // =========================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // =========================
  // QUERY SUPABASE
  // =========================
  let query = supabase
    .from("receipts")
    .select(
      `
    id,
    merchant_name,
    total_amount,
    receipt_date,
    image_url,
    notes,
    categories ( name, icon, color ),
    receipt_items (
      id,
      item_name,
      price,
      qty
    )
  `,
      { count: "exact" }, // total page
    )
    .eq("user_id", user.id)
    .order("receipt_date", { ascending: false })
    .range(from, to); // pagination

  // ── FILTERS ──────────────────────────────────
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (startDate && endDate) {
    query = query.gte("receipt_date", startDate).lte("receipt_date", endDate);
  } else if (startDate) {
    query = query.gte("receipt_date", startDate);
  } else if (endDate) {
    query = query.lte("receipt_date", endDate);
  }

  if (cleanSearch) {
    query = query.or(
      `merchant_name.ilike.%${cleanSearch}%,notes.ilike.%${cleanSearch}%`,
    );
  }

  // ── SORTING ──────────────────────────────────
  if (sort === "newest") {
    query = query.order("receipt_date", { ascending: false });
  } else if (sort === "oldest") {
    query = query.order("receipt_date", { ascending: true });
  } else if (sort === "highest") {
    query = query.order("total_amount", { ascending: false });
  } else if (sort === "lowest") {
    query = query.order("total_amount", { ascending: true });
  }

  // ── ORDER (IMPORTANT: pakai receipt_date) ────
  query = query.order("receipt_date", { ascending: false });

  // ── EXECUTE ──────────────────────────────────
  const { data, error, count } = await query;

  if (error) {
    console.error("GET /receipt error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    receipts: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

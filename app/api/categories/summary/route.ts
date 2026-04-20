import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
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
  // FETCH RECEIPTS + CATEGORY
  // =========================
  let query = supabase
    .from("receipts")
    .select(
      `
    total_amount,
    categories (id, name, icon, color)
  `,
    )
    .eq("user_id", user.id);

  if (startDate) query = query.gte("receipt_date", startDate);
  if (endDate) query = query.lte("receipt_date", endDate + "T23:59:59");

  const { data, error } = await query;

  if (error) {
    console.error("GET /categories/summary error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // =========================
  // AGGREGATION
  // =========================
  const map: Record<string, any> = {};

  data.forEach((r: any) => {
    const cat = r.categories;

    const key = cat?.id || "uncategorized";

    if (!map[key]) {
      map[key] = {
        id: cat?.id || null,
        name: cat?.name || "Uncategorized",
        icon: cat?.icon || null,
        color: cat?.color || "#888888",
        total: 0,
        count: 0,
      };
    }

    map[key].total += r.total_amount || 0;
    map[key].count += 1;
  });

  // =========================
  // SORT + LIMIT TOP 3
  // =========================
  const result = Object.values(map)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 3);

  return NextResponse.json({
    categories: result,
  });
}

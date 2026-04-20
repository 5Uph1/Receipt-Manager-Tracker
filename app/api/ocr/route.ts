import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const OCR_API_KEY = process.env.OCR_API_KEY;

  if (!OCR_API_KEY) {
    return NextResponse.json(
      { error: "OCR service tidak dikonfigurasi" },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  try {
    const body = await req.json();
    const { imageUrl } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // VALIDASI
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl harus berupa string" },
        { status: 400 },
      );
    }

    // OCR ONLY
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        apikey: OCR_API_KEY,
        url: imageUrl,
        language: "eng",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "OCR error", detail: errText },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (data.IsErroredOnProcessing) {
      return NextResponse.json(
        { error: data.ErrorMessage?.[0] },
        { status: 422 },
      );
    }

    const text = data?.ParsedResults?.[0]?.ParsedText?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Teks tidak ditemukan", fallback: true },
        { status: 200 },
      );
    }

    // ✅ RETURN ONLY TEXT
    return NextResponse.json({
      success: true,
      text,
      raw: data, // opsional (debug)
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

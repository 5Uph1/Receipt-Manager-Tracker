"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/client/supabaseClient";
import { useRouter } from "next/router";

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (!data.user) {
        router.replace("/auth");
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Pilih file dulu");
      return;
    }

    // 🔒 validasi file
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus gambar");
      return;
    }

    if (!user) {
      setErrorMsg("User belum siap");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

      // 🔥 upload
      const { error: uploadError } = await supabaseClient.storage
        .from("receipts")
        .upload(`${user.id}/${fileName}`, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicData } = supabaseClient.storage
        .from("receipts")
        .getPublicUrl(`${user.id}/${fileName}`);

      const imageUrl = publicData.publicUrl;

      // 🔥 OCR
      const ocrRes = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!ocrRes.ok) throw new Error("OCR gagal");

      const ocrData = await ocrRes.json();

      if (!ocrData.text) throw new Error("Teks tidak terbaca");

      // 🔥 PARSE
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: ocrData.text }),
      });

      if (!parseRes.ok) throw new Error("Parsing gagal");

      const parseData = await parseRes.json();

      setResult(parseData.result);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {result && (
        <pre className="mt-4 bg-gray-100 p-2 text-black">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Category {
  name: string;
  color: string;
  total: number;
  count: number;
}

interface Receipt {
  id: string;
  merchant_name: string;
  total_amount: number;
  receipt_date: string;
  image_url?: string;
  categories?: {
    name: string;
    color: string;
  };
}

interface ExportPDFOptions {
  totalSpent: number;
  dateLabel: string;
  percentage: number;
  comparisonLabel: string;
  topCategories: Category[];
  receipts: Receipt[];
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export async function exportToPDF(options: ExportPDFOptions): Promise<void> {
  const {
    totalSpent,
    dateLabel,
    percentage,
    comparisonLabel,
    topCategories,
    receipts,
  } = options;

  // ── Build off-screen HTML ──────────────────────────────────────────────────
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    color: #0F172A;
    padding: 48px;
    box-sizing: border-box;
  `;

  const trend =
    percentage >= 0
      ? `▲ +${percentage.toFixed(1)}%`
      : `▼ ${percentage.toFixed(1)}%`;
  const trendColor = percentage >= 0 ? "#16A34A" : "#DC2626";

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; }
    </style>

    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:36px;">
      <div>
        <div style="font-size:22px; font-weight:800; color:#2563EB; letter-spacing:-0.5px;">
          Kasih Uang Dah
        </div>
        <div style="font-size:12px; color:#64748B; margin-top:2px;">Spending Report</div>
      </div>
      <div style="font-size:11px; color:#94A3B8;">
        Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
      </div>
    </div>

    <!-- Divider -->
    <div style="height:1px; background:#E2E8F0; margin-bottom:32px;"></div>

    <!-- Summary Card -->
    <div style="
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      border-radius:20px;
      padding:32px;
      margin-bottom:28px;
    ">
      <div style="font-size:13px; color:#BFDBFE; font-weight:600; margin-bottom:6px;">
        Total Spent — ${dateLabel}
      </div>
      <div style="font-size:38px; font-weight:800; color:#FFFFFF; letter-spacing:-1px; margin-bottom:10px;">
        ${formatRupiah(totalSpent)}
      </div>
      <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.15); border-radius:8px; padding:4px 12px;">
        <span style="font-size:13px; font-weight:700; color:${percentage >= 0 ? "#86EFAC" : "#FCA5A5"}">
          ${trend}
        </span>
        <span style="font-size:12px; color:#BFDBFE;">${comparisonLabel}</span>
      </div>
    </div>

    <!-- Top Categories -->
    ${
      topCategories.length > 0
        ? `
    <div style="margin-bottom:28px;">
      <div style="font-size:15px; font-weight:700; color:#0F172A; margin-bottom:16px;">
        Top Categories
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        ${topCategories
          .map(
            (cat) => `
          <div style="
            display:flex;
            align-items:center;
            gap:12px;
            padding:14px 16px;
            border:1px solid #E2E8F0;
            border-radius:14px;
            background:#F8FAFC;
          ">
            <div style="
              width:38px; height:38px;
              border-radius:10px;
              background:${cat.color}18;
              display:flex; align-items:center; justify-content:center;
              font-size:18px;
            ">📊</div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:13px; font-weight:700; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${cat.name}
              </div>
              <div style="font-size:11px; color:#64748B;">${cat.count} transactions</div>
            </div>
            <div style="font-size:13px; font-weight:700; color:#0F172A; white-space:nowrap;">
              ${formatRupiah(cat.total)}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- Receipts Table -->
    <div>
      <div style="font-size:15px; font-weight:700; color:#0F172A; margin-bottom:16px;">
        All Receipts
        <span style="font-size:12px; font-weight:500; color:#64748B; margin-left:8px;">
          (${receipts.length} transactions)
        </span>
      </div>

      <!-- Table Header -->
      <div style="
        display:grid;
        grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
        gap:8px;
        padding:10px 16px;
        background:#EFF6FF;
        border-radius:10px;
        margin-bottom:6px;
      ">
        <div style="font-size:11px; font-weight:700; color:#2563EB; text-transform:uppercase; letter-spacing:0.5px;">Merchant</div>
        <div style="font-size:11px; font-weight:700; color:#2563EB; text-transform:uppercase; letter-spacing:0.5px;">Date</div>
        <div style="font-size:11px; font-weight:700; color:#2563EB; text-transform:uppercase; letter-spacing:0.5px;">Category</div>
        <div style="font-size:11px; font-weight:700; color:#2563EB; text-transform:uppercase; letter-spacing:0.5px; text-align:right;">Amount</div>
      </div>

      <!-- Table Rows -->
      ${receipts
        .map(
          (r, i) => `
        <div style="
          display:grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
          gap:8px;
          padding:12px 16px;
          background:${i % 2 === 0 ? "#FFFFFF" : "#F8FAFC"};
          border-radius:8px;
          border:1px solid ${i % 2 === 0 ? "transparent" : "#F1F5F9"};
          align-items:center;
        ">
          <div style="font-size:13px; font-weight:600; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${r.merchant_name}
          </div>
          <div style="font-size:12px; color:#64748B;">${formatDate(r.receipt_date)}</div>
          <div>
            <span style="
              font-size:10px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:0.5px;
              color:${r.categories?.color || "#94A3B8"};
              background:${r.categories?.color || "#94A3B8"}18;
              padding:3px 8px;
              border-radius:6px;
            ">
              ${r.categories?.name || "Uncategorized"}
            </span>
          </div>
          <div style="font-size:13px; font-weight:700; color:#0F172A; text-align:right;">
            ${formatRupiah(r.total_amount)}
          </div>
        </div>
      `,
        )
        .join("")}

      <!-- Total Row -->
      <div style="
        display:grid;
        grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
        gap:8px;
        padding:14px 16px;
        background:#EFF6FF;
        border-radius:10px;
        margin-top:8px;
        align-items:center;
      ">
        <div style="font-size:13px; font-weight:800; color:#2563EB; grid-column:span 3;">Total</div>
        <div style="font-size:15px; font-weight:800; color:#2563EB; text-align:right;">
          ${formatRupiah(totalSpent)}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px; padding-top:20px; border-top:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-size:11px; color:#94A3B8;">Kasih Uang Dah — Premium Archive</div>
      <div style="font-size:11px; color:#94A3B8;">Page 1 of 1</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    // ── Multi-page support if content overflows ──────────────────────────────
    let yOffset = 0;
    while (yOffset < scaledHeight) {
      if (yOffset > 0) pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, scaledHeight);

      yOffset += pdfHeight;
    }

    const fileName = `kasih-uang-dah_${dateLabel.toLowerCase().replace(/\s+/g, "-")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

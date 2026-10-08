// utils/invoicePdf.js — turns a rendered <InvoicePreview> into an A4 jsPDF.
// Blocks marked data-inv-section are never split across pages, and every page
// after the first starts with a little room at the top.
export async function invoicePdf(wrapEl) {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const SCALE = 2;
  const TOP_MM = 12;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const wrapRect = wrapEl.getBoundingClientRect();
  const bounds = Array.from(wrapEl.querySelectorAll("[data-inv-section]")).map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top - wrapRect.top, bottom: r.bottom - wrapRect.top };
  });

  const canvas = await html2canvas(wrapEl, {
    scale: SCALE, useCORS: true, backgroundColor: "#fff", logging: false,
    height: wrapEl.scrollHeight, windowHeight: wrapEl.scrollHeight,
    onclone: (doc) => {
      const st = doc.createElement("style");
      st.textContent = "* { font-family: Arial, Helvetica, sans-serif !important; }";
      doc.head.appendChild(st);
    },
  });

  const pxPerMm = canvas.width / pageW;
  const domToCvs = canvas.width / wrapEl.offsetWidth;
  const sections = bounds.map((s) => ({ top: s.top * domToCvs, bottom: s.bottom * domToCvs }));

  const cuts = [0];
  while (true) {
    const last = cuts[cuts.length - 1];
    let next = last + (cuts.length === 1 ? pageH : pageH - TOP_MM) * pxPerMm;
    if (next >= canvas.height) break;
    for (const s of sections) {
      if (s.top < next && s.bottom > next && s.top > last) next = Math.min(next, s.top);
    }
    cuts.push(next);
  }
  cuts.push(canvas.height);

  for (let i = 0; i < cuts.length - 1; i++) {
    if (i > 0) pdf.addPage();
    const h = cuts[i + 1] - cuts[i];
    const sc = document.createElement("canvas");
    sc.width = canvas.width; sc.height = h;
    sc.getContext("2d").drawImage(canvas, 0, cuts[i], canvas.width, h, 0, 0, canvas.width, h);
    pdf.addImage(sc.toDataURL("image/png"), "PNG", 0, i > 0 ? TOP_MM : 0, pageW, h / pxPerMm);
  }
  return pdf;
}

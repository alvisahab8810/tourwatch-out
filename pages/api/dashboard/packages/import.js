import formidable from "formidable";
import * as XLSX from "xlsx";
import fs from "fs";
import connectDB from "../../../../utils/mongodb";
import Package from "../../../../models/Package";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: false } };

/* ── helpers ─────────────────────────────────────────────── */
function clean(v) {
  return v == null ? "" : String(v).trim();
}

function parseDuration(text) {
  const m = text.match(/(\d+)\s*N\s*[\/]?\s*(\d+)\s*D/i);
  if (!m) return "";
  return `${m[1]}N ${m[2]}D`.toUpperCase();
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/*
  structuredHtml — converts [{text, bold}] to HTML that Quill understands.
  Bold items  → <p><strong>text</strong></p>  (section header, no bullet)
  Normal items → <li>text</li> grouped inside <ul>
*/
function structuredHtml(items) {
  if (!items || !items.length) return "";
  let html = "";
  let inList = false;

  for (const item of items) {
    if (!item.text || item.text.length < 2) continue;
    if (item.bold) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p><strong>${escHtml(item.text)}</strong></p>`;
    } else {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${escHtml(item.text)}</li>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

/* ── Bold detection ──────────────────────────────────────── */
/*
  SheetJS CE has three ways bold can appear:
  1. cell.s.font.bold  — whole-cell style (requires cellStyles:true)
  2. cell.r            — raw rich-text XML from shared strings, e.g.
                         "<r><rPr><b/></rPr><t>Meals</t></r>"
                         Used when only PART of the cell is bold (partial bold).
  3. cell.h            — HTML rendering (requires cellHTML:true), e.g.
                         "<b>Gulmarg:</b> Handloom…"
  We check all three so both "full-cell bold" and "starts-bold" cells are caught.
*/
function isCellBold(cell) {
  if (!cell) return false;
  // Method 1: whole-cell style
  if (cell.s?.font?.bold) return true;
  // Method 2: rich text XML contains a bold run marker
  if (typeof cell.r === "string" && /<b(\s|\/|>)/i.test(cell.r)) return true;
  // Method 3: HTML rendering starts with <b> (partially bold cell)
  if (typeof cell.h === "string" && /^\s*<b>/i.test(cell.h)) return true;
  return false;
}

/* ── Read sheet rows with per-cell bold flag ─────────────── */
function readSheetRows(ws) {
  if (!ws["!ref"]) return [];
  const range = XLSX.utils.decode_range(ws["!ref"]);
  const rows  = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    const row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      row.push({
        v:    cell ? clean(cell.v ?? cell.w ?? "") : "",
        bold: isCellBold(cell),
      });
    }
    rows.push(row);
  }
  return rows.filter(r => r.some(c => c.v !== ""));
}

/* ── Section markers ─────────────────────────────────────── */
function getSectionMarker(text) {
  if (!text) return null;
  const norm = text.toUpperCase().replace(/\s+/g, "");
  if (norm === "INCLUSIONS") return "inclusions";
  if (norm === "EXCLUSIONS") return "exclusions";
  if (norm.startsWith("ABOUTDESTINATION")) return "about";
  return null;
}

/* ── Noise filter for content lines ─────────────────────── */
const NOISE_RE = [
  /^Price\s+Details\s*[:/]/i,
  /^(ECONOMY|DELUXE|PREMIUM)\s*[:/]/i,
  /^(COST|PRICE|RATE)\s/i,
  /^\d{1,3},\d{3}/,
  /^Above\s+\d+/i,
  /^Add\s+including/i,
];
function isNoise(v) {
  if (!v || v.length < 2) return true;
  return NOISE_RE.some(r => r.test(v));
}

/* ── Day-header detection ────────────────────────────────── */
function parseDayCell(text) {
  if (!/^Day\s*\d+/i.test(text)) return null;
  const num   = parseInt(text.replace(/^Day\s*/i, "").replace(/[^\d].*$/, "")) || 1;
  const title = text.replace(/^Day\s*\d+\s*/i, "").trim();
  return { num, title };
}

/* ── Metadata extractors ─────────────────────────────────── */
function extractDestination(text) {
  const m = text.match(/^Destination\s*[-:]\s*(.+)$/i);
  if (!m) return null;
  const val = m[1].trim();
  if (/^Highlight/i.test(val)) return null;
  return val;
}
function extractPackageType(text) {
  const m = text.match(/^Package\s+[Tt]ype\s*[-:]\s*(.+)$/i);
  if (!m) return null;
  const val = m[1].trim();
  const types = ["Family", "Couple", "Corporate", "Honeymoon", "Group"];
  return types.find(t => t.toLowerCase() === val.toLowerCase()) || val;
}
function extractSubtype(text) {
  const m = text.match(/^Package\s+sub\s+type\s*[-:]\s*(.+)$/i);
  if (!m) return null;
  const val = m[1].replace(/,\s*$/, "").trim();
  const subs = ["Economy", "Deluxe", "Premium"];
  return subs.find(s => s.toLowerCase() === val.toLowerCase()) || val;
}
function extractName(text) {
  const m = text.match(/^Package\s+Name\s*[-–:]\s*(.+)$/i);
  return m ? m[1].trim() : null;
}
function extractDuration(text) {
  const m = text.match(/^Duration\s*[-:]\s*(.+)$/i);
  if (!m) return null;
  return parseDuration(m[1]) || null;
}
function extractDestHighlight(text) {
  const m = text.match(/^Destination\s+[Hh]ighlight\s*[-:]\s*(.+)$/i);
  return m ? m[1].trim() : null;
}
function extractBasePrice(text) {
  const m = text.match(/^Base\s*[Pp]rice\s*[-:]\s*([\d,]+)/i);
  return m ? m[1].replace(/,/g, "") : null;
}
function extractFinalPrice(text) {
  const m = text.match(/^Final\s*[Pp]rice\s*[-:–\s]+([\d,]+)/i);
  return m ? m[1].replace(/,/g, "") : null;
}
function extractPriceType(text) {
  const m = text.match(/^(per\b.+)$/i);
  if (!m) return null;
  const raw = m[1].trim();
  if (/^per\s+couple$/i.test(raw)) return "Per Couple";
  if (/^per\s+person$/i.test(raw)) return "Per Person";
  if (/^per\s+group$/i.test(raw))  return "Per Group";
  if (/1\s+couple.*1\s+child.*below\s+5/i.test(raw)) return "01 Couple + 01 Child (below 5 years)";
  if (/1\s+couple.*1\s+child.*below\s+4/i.test(raw)) return "01 Couple + 01 Child (below 4 years) + 01 Child (below 10 years)";
  return raw;
}

/* ── Apply one metadata line ─────────────────────────────── */
function applyMeta(text, current, pending, sheetState) {
  if (!text) return false;

  const set = (field, value) => {
    if (current) { if (!current[field]) current[field] = value; }
    else          { if (!pending[field]) pending[field] = value; }
  };

  const dest = extractDestination(text);
  if (dest) {
    if (!current) sheetState.dest = sheetState.dest || dest;
    set("destination", dest);
    return true;
  }
  const pkgType = extractPackageType(text);
  if (pkgType) { set("packageType", pkgType); return true; }

  const sub = extractSubtype(text);
  if (sub)  { set("packageSubtype", sub); return true; }

  const name = extractName(text);
  if (name) { set("packageName", name); return true; }

  const dur = extractDuration(text);
  if (dur)  { set("duration", dur); return true; }

  const dh = extractDestHighlight(text);
  if (dh)   { set("destinationHighlights", dh); return true; }

  const bp = extractBasePrice(text);
  if (bp)   { set("basePrice", bp); return true; }

  const fp = extractFinalPrice(text);
  if (fp)   { set("finalPrice", fp); return true; }

  const pt = extractPriceType(text);
  if (pt)   { set("priceType", pt); return true; }

  if (/^Price\s+Details\s*[:/]/i.test(text)) return true; // skip header row

  return false;
}

/* ── Core sheet parser ───────────────────────────────────── */
function parseSheet(rows) {
  const packages   = [];
  const sheetState = { dest: "" };

  const emptyPending = () => ({
    destination: "", packageType: "", packageSubtype: "", packageName: "",
    duration: "", destinationHighlights: "", basePrice: "", finalPrice: "", priceType: "",
  });

  let pending    = emptyPending();
  let current    = null;
  let currentDay = null;
  let section    = "pre";

  function flushDay() {
    if (currentDay) { current.days.push(currentDay); currentDay = null; }
  }
  function flushPkg() {
    if (!current) return;
    flushDay();
    if (current.days.length || current._inc.length || current._exc.length) {
      packages.push(current);
    }
    current = null;
    section = "pre";
  }
  function startPkg() {
    flushPkg();
    current = {
      packageName:           pending.packageName    || "",
      destination:           pending.destination    || sheetState.dest,
      packageType:           pending.packageType    || "",
      packageSubtype:        pending.packageSubtype || "",
      duration:              pending.duration       || "",
      destinationHighlights: pending.destinationHighlights || "",
      basePrice:             pending.basePrice      || "",
      finalPrice:            pending.finalPrice     || "",
      priceType:             pending.priceType      || "",
      days:  [],
      _inc:  [],   // [{text, bold}]
      _exc:  [],
      aboutText: "",
    };
    pending = emptyPending();
    section = "meta";
  }

  for (const row of rows) {
    // row[n] = { v: string, bold: boolean }
    const ca = row[0] || { v: "", bold: false };
    const cb = row[1] || { v: "", bold: false };
    const cc = row[2] || { v: "", bold: false };

    const colA = ca.v;
    const colB = cb.v;
    const colC = cc.v;

    // Main text content (prefer col C, then col B, then col A if not a bare number)
    const mainCell = colC ? cc : colB ? cb : (colA && !/^\d+$/.test(colA) ? ca : { v: "", bold: false });
    const main     = mainCell.v;
    const mainBold = mainCell.bold;

    /* ── Package-number trigger ─── */
    if (/^\d+$/.test(colA) || /^\d+$/.test(colB)) {
      startPkg();
      const sameRow = /^\d+$/.test(colA) ? (colC || colB) : colC;
      if (sameRow) applyMeta(sameRow, current, pending, sheetState);
      continue;
    }

    /* ── Before any package starts ─── */
    if (!current) {
      applyMeta(main, null, pending, sheetState);
      continue;
    }

    /* ── Section markers ─── */
    const sm = getSectionMarker(main);
    if (sm) {
      if (sm === "inclusions") flushDay();
      section = sm;
      continue;
    }

    /* ── Day header: col B alone, or combined in main ─── */
    if (colB) {
      const d = parseDayCell(colB);
      if (d) {
        flushDay();
        currentDay = { day: d.num, title: colC || d.title, icon: "", description: "" };
        section    = "itinerary";
        continue;
      }
    }
    if (main) {
      const d = parseDayCell(main);
      if (d) {
        flushDay();
        currentDay = { day: d.num, title: d.title || main, icon: "", description: "" };
        section    = "itinerary";
        continue;
      }
    }

    /* ── Meta section ─── */
    if (section === "meta") {
      applyMeta(main, current, pending, sheetState);
      continue;
    }

    /* ── Content sections ─── */
    if (!main || isNoise(main)) continue;

    if (section === "itinerary" && currentDay) {
      currentDay.description = currentDay.description
        ? currentDay.description + "\n" + main
        : main;
    } else if (section === "inclusions") {
      current._inc.push({ text: main, bold: mainBold });
    } else if (section === "exclusions") {
      current._exc.push({ text: main, bold: mainBold });
    } else if (section === "about") {
      current.aboutText += (current.aboutText ? " " : "") + main;
    }
  }

  flushPkg();
  return packages;
}

/* ── Main entry ──────────────────────────────────────────── */
function parseExcelToPackages(filePath) {
  // cellStyles: reads .s.font.bold (whole-cell bold)
  // cellHTML:   reads .h HTML string (partial/rich-text bold)
  const workbook = XLSX.readFile(filePath, { cellStyles: true, cellHTML: true });
  const result   = [];

  for (const sheetName of workbook.SheetNames) {
    const ws   = workbook.Sheets[sheetName];
    const rows = readSheetRows(ws);
    if (!rows.length) continue;
    result.push(...parseSheet(rows));
  }

  for (const pkg of result) {
    pkg.inclusions = structuredHtml(pkg._inc);
    pkg.exclusions = structuredHtml(pkg._exc);
    delete pkg._inc;
    delete pkg._exc;
    if (!pkg.packageName) pkg.packageName = "Imported Package";
  }

  return result;
}

/* ── API handler ─────────────────────────────────────────── */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ maxFileSize: 20 * 1024 * 1024 });
  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (e) {
    return res.status(400).json({ error: "Upload parse failed: " + e.message });
  }

  const file = Array.isArray(files.file) ? files.file[0] : files.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  let packages;
  try {
    packages = parseExcelToPackages(file.filepath);
  } catch (e) {
    try { fs.unlinkSync(file.filepath); } catch {}
    return res.status(400).json({ error: "Excel parse failed: " + e.message });
  }

  /* ── Preview mode ── */
  if (fields.preview?.[0] === "true") {
    let debugRows = [];
    if (!packages.length) {
      try {
        const wb2 = XLSX.readFile(file.filepath);
        const ws2 = wb2.Sheets[wb2.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws2, { header: 1, defval: "" })
          .filter(r => r.some(c => clean(c) !== "")).slice(0, 25);
        debugRows = raw.map(r => r.slice(0, 6).map(clean));
      } catch {}
    }
    try { fs.unlinkSync(file.filepath); } catch {}
    return res.status(200).json({ packages, debugRows });
  }

  /* ── Import mode ── */
  await connectDB();
  const results = [];

  for (const pkg of packages) {
    const destination    = pkg.destination    || "";
    const packageType    = pkg.packageType    || "Family";
    const packageSubtype = pkg.packageSubtype || "Economy";
    const duration       = pkg.duration       || "";
    const packageName    = pkg.packageName;

    if (!destination) {
      results.push({ success: false, name: packageName, error: "Missing destination — add 'Destination - ...' row in the file" });
      continue;
    }

    /* ── Duplicate check ── */
    try {
      const dup = await Package.findOne({ packageName, destination, packageSubtype });
      if (dup) {
        results.push({ success: false, name: packageName, error: "Duplicate: already exists in database" });
        continue;
      }
    } catch (e) {
      results.push({ success: false, name: packageName, error: "DB check failed: " + e.message });
      continue;
    }

    try {
      await Package.create({
        _id:                   uuidv4(),
        destination,
        packageType,
        packageSubtype,
        packageName,
        itineraryTitle:        packageName,
        duration,
        basePrice:             pkg.basePrice             || "",
        finalPrice:            pkg.finalPrice            || "",
        priceType:             pkg.priceType             || "Per Couple",
        destinationHighlights: pkg.destinationHighlights || "",
        aboutText:             pkg.aboutText             || "",
        days: pkg.days.length
          ? pkg.days
          : [{ day: 1, title: "", icon: "", description: "" }],
        inclusions:  pkg.inclusions,
        exclusions:  pkg.exclusions,
        amenities:   [],
        gallery:     [{ src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }, { src: null, alt: "" }],
        aboutImages:  [{ src: null, alt: "" }, { src: null, alt: "" }],
        bucketImages: [{ src: null, alt: "" }, { src: null, alt: "" }],
        featureImage:  { src: null, alt: "" },
        webBanner:     { src: null, alt: "" },
        mobileBanner:  { src: null, alt: "" },
        priceImage:    { src: null, alt: "" },
        advertisement: { headline: "", subtext: "", callbackType: "Call", image: { src: null, alt: "" } },
        bookingPolicy: "", cancellationPolicy: "", termsConditions: "",
        metaTitle: packageName, metaDescription: "", metaKeywords: "",
        status: "Inactive", popular: false,
      });
      results.push({ success: true, name: packageName });
    } catch (e) {
      results.push({ success: false, name: packageName, error: e.message });
    }
  }

  try { fs.unlinkSync(file.filepath); } catch {}

  res.status(200).json({
    imported: results.filter(r => r.success).length,
    failed:   results.filter(r => !r.success).length,
    results,
  });
}

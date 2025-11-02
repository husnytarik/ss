// Basit yardımcılar
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

// CSV indirme
export function downloadCSV(filename, rows) {
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Tarih yardımcıları
export const fmtDate = (d) => new Date(d).toISOString().split("T")[0];

// Basit filtreleme
export function textMatch(s, q) {
  return String(s || "")
    .toLowerCase()
    .includes(String(q || "").toLowerCase());
}

// URL param
export function getParam(name) {
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

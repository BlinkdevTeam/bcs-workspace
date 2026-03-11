import { useState } from "react";

import DocumentModal from "./DocumentModal";

// ── DOCUMENTS TAB ─────────────────────────────────────────────────────────────
export default function DocumentsTab() {
  const [filter, setFilter]     = useState("All");
  const [selected, setSelected] = useState(null);

  const docs = [
    { name: "Employment Contract",      type: "Contract", size: "248 KB", uploaded: "Jan 12, 2021", uploader: "HR Admin",    status: "Signed",  ext: "pdf",  version: "v1.0" },
    { name: "NDA — Mutual",             type: "Legal",    size: "112 KB", uploaded: "Jan 12, 2021", uploader: "HR Admin",    status: "Signed",  ext: "pdf",  version: "v1.0" },
    { name: "Benefits Enrollment Form", type: "Benefits", size: "89 KB",  uploaded: "Feb 1, 2021",  uploader: "Sara Okafor", status: "Signed",  ext: "pdf",  version: "v1.0" },
    { name: "2025 Performance Review",  type: "Review",   size: "340 KB", uploaded: "Feb 10, 2026", uploader: "Devon Park",  status: "Signed",  ext: "pdf",  version: "v1.0" },
    { name: "2024 Performance Review",  type: "Review",   size: "312 KB", uploaded: "Feb 8, 2025",  uploader: "Devon Park",  status: "Signed",  ext: "pdf",  version: "v1.0" },
    { name: "Remote Work Policy Ack.",  type: "Policy",   size: "54 KB",  uploaded: "Jan 5, 2023",  uploader: "HR Admin",    status: "Signed",  ext: "pdf",  version: "v2.1" },
    { name: "Q1 2026 Goal Sheet",       type: "Review",   size: "76 KB",  uploaded: "Jan 15, 2026", uploader: "Sara Okafor", status: "Pending", ext: "docx", version: "v1.0" },
    { name: "Payslip — Jan 2026",       type: "Payroll",  size: "42 KB",  uploaded: "Feb 1, 2026",  uploader: "Payroll Sys", status: "Auto",    ext: "pdf",  version: "auto" },
    { name: "Payslip — Dec 2025",       type: "Payroll",  size: "42 KB",  uploaded: "Jan 1, 2026",  uploader: "Payroll Sys", status: "Auto",    ext: "pdf",  version: "auto" },
  ];

  const cats     = ["All", "Contract", "Legal", "Benefits", "Review", "Policy", "Payroll"];
  const filtered = filter === "All" ? docs : docs.filter(d => d.type === filter);
  const dSS      = { Signed: { bg: "#0f1f0f", color: "#5af07a" }, Pending: { bg: "#1f1a0f", color: "#f0c85a" }, Auto: { bg: "#111", color: "#888" } };
  const extCol   = { pdf: "#f05a5a", docx: "#5a9af0", xlsx: "#5af07a" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className="px-3 py-1.5 rounded text-xs transition-all"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: filter === c ? "#fff" : "#111", color: filter === c ? "#000" : "#666", border: filter === c ? "none" : "1px solid #2a2a2a" }}>
              {c}
            </button>
          ))}
        </div>
        <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>⬆ Upload</button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
              {["Document", "Type", "Version", "Size", "Uploaded", "By", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-normal text-gray-600"
                  style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => (
              <tr key={i}
                onClick={() => setSelected(doc)}
                className="cursor-pointer group transition-colors"
                style={{ borderBottom: "1px solid #141414", backgroundColor: "#0d0d0d" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#141414"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d0d0d"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: extCol[doc.ext] || "#888" }}>
                      {doc.ext.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-200 text-sm group-hover:text-white transition-colors" style={{ fontFamily: "system-ui,sans-serif" }}>{doc.name}</p>
                      <p className="text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "system-ui,sans-serif" }}>Click to preview</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1a1a1a", color: "#888" }}>{doc.type}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs" style={{ fontFamily: "monospace" }}>{doc.version}</td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{doc.size}</td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{doc.uploaded}</td>
                <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{doc.uploader}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...dSS[doc.status] }}>{doc.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>
        {filtered.length} document{filtered.length !== 1 ? "s" : ""} · Click any row to preview · All files encrypted at rest
      </p>

      {selected && <DocumentModal doc={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
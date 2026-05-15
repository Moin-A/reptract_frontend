"use client";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  perPage?: number;
  onChange: (page: number) => void;
}

function buildPageWindows(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const head = new Set([1, 2, 3]);
  const tail = new Set([total - 2, total - 1, total]);
  const mid  = new Set([current - 1, current, current + 1].filter(p => p >= 1 && p <= total));

  const pages = Array.from(new Set([...head, ...mid, ...tail])).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) result.push("...");
    result.push(pages[i]);
  }
  return result;
}

export function Pagination({ currentPage, totalItems, perPage = 5, onChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages <= 1) return null;

  function go(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onChange(page);
  }

  const btnStyle = (active = false): React.CSSProperties => ({
    minWidth: 34, height: 34, padding: "0 10px",
    border: "1px solid #ddd", borderRadius: 8,
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#111",
    cursor: "pointer", fontSize: 14, fontWeight: 500,
  });

  const ellipsisStyle: React.CSSProperties = {
    minWidth: 34, height: 34, display: "inline-flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 14, color: "#999", userSelect: "none",
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => go(currentPage - 1)} disabled={currentPage === 1} style={btnStyle()}>
          Prev
        </button>

        {buildPageWindows(currentPage, totalPages).map((item, i) =>
          item === "..."
            ? <span key={`ellipsis-${i}`} style={ellipsisStyle}>…</span>
            : <button key={item} onClick={() => go(item)} style={btnStyle(item === currentPage)}>{item}</button>
        )}

        <button onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages} style={btnStyle()}>
          Next
        </button>
      </div>
    </div>
  );
}

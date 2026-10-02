/** Download rows as a CSV with a BOM, so Excel opens it with the right encoding. */
export function exportCsv(
  filename: string,
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): void {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

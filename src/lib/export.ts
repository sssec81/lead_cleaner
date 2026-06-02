export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadCsvFile(
  filename: string,
  rows: string[],
  header = "email",
) {
  const csvBody = [header, ...rows].join("\n");
  const blob = new Blob([csvBody], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadCsvContent(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

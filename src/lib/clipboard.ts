export async function copyTextToClipboard(text: string) {
 if (!text) {
 return false;
 }

 try {
 await navigator.clipboard.writeText(text);
 return true;
 } catch {
 return false;
 }
}

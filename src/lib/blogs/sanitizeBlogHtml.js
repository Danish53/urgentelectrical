/** Clean CMS HTML before rendering (strip editor artifacts). */
export function sanitizeBlogHtml(html) {
  if (!html || typeof html !== "string") return "";

  let out = html;

  out = out.replace(/<response-element[^>]*>([\s\S]*?)<\/response-element>/gi, "$1");
  out = out.replace(/<\/?link-block[^>]*>/gi, "");
  out = out.replace(/<!---->/g, "");
  out = out.replace(/\s+data-path-to-node="[^"]*"/gi, "");
  out = out.replace(/\s+data-index-in-node="[^"]*"/gi, "");
  out = out.replace(/\s+ng-version="[^"]*"/gi, "");
  out = out.replace(/\s+_nghost-ng-c\d+=""/gi, "");
  out = out.replace(/\s+_ngcontent-ng-c\d+=""/gi, "");
  out = out.replace(/\s+class="ng-star-inserted"/gi, "");
  out = out.replace(/\s+jslog="[^"]*"/gi, "");
  out = out.replace(/\s+data-hveid="[^"]*"/gi, "");
  out = out.replace(/\s+data-ved="[^"]*"/gi, "");
  out = out.replace(/\s+decode-data-ved="[^"]*"/gi, "");
  out = out.replace(/\s+externallink=""/gi, "");

  return out.trim();
}

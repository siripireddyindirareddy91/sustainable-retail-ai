import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { products } from "../src/lib/catalog";
// CSV columns: id,name,brand,category,price,description,image. Other evidence remains unknown.
const { values } = parseArgs({
  options: { file: { type: "string" }, endpoint: { type: "string" } },
});
if (!values.file || !values.endpoint || !process.env.ECO_ADMIN_TOKEN)
  throw new Error(
    "Use --file catalog.csv --endpoint https://YOUR_APP; set ECO_ADMIN_TOKEN privately.",
  );
function csv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" && !quoted) {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (quoted) throw new Error("Unclosed CSV quotation");
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
async function main() {
  const [head, ...rows] = csv(readFileSync(values.file!, "utf8"));
  for (const row of rows.filter((r) => r.some(Boolean))) {
    const fields = Object.fromEntries(
      head.map((h, i) => [h.trim(), row[i]?.trim() || ""]),
    );
    const p = {
      ...structuredClone(products[0]),
      ...fields,
      price: Number(fields.price),
      originalPrice: Number(fields.price),
      rating: 0,
      reviews: 0,
      carbon: null,
      materials: "Unavailable",
      packaging: "Unavailable",
      specifications: { Availability: "Demonstration import; not for sale" },
      attributes: Object.fromEntries(
        Object.keys(products[0].attributes).map((k) => [
          k,
          {
            value: null,
            status: "unavailable",
            note: "No supporting evidence provided.",
          },
        ]),
      ),
    };
    const response = await fetch(
      new URL("/api/admin/products", values.endpoint),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ECO_ADMIN_TOKEN}`,
        },
        body: JSON.stringify(p),
      },
    );
    if (!response.ok)
      throw new Error(`Import failed for ${p.id}: ${response.status}`);
    console.log(`Imported ${p.id}`);
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

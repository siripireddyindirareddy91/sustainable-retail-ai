import { products } from "@/lib/catalog";
const shapes: Record<string, string> = {
  computer:
    '<rect x="28" y="28" width="144" height="105" rx="9"/><path d="M15 148h170l-12 16H27z"/><path d="M38 40h124v80H38z" opacity=".35"/>',
  camera:
    '<rect x="23" y="50" width="154" height="108" rx="16"/><path d="M52 50l12-24h64l12 24"/><circle cx="100" cy="104" r="35"/><circle cx="100" cy="104" r="24" opacity=".4"/><circle cx="155" cy="70" r="5"/>',
  audio:
    '<path d="M30 110V85a70 70 0 01140 0v25"/><rect x="24" y="91" width="32" height="70" rx="14"/><rect x="144" y="91" width="32" height="70" rx="14"/>',
  watch:
    '<path d="M73 52l8-37h38l8 37M73 148l8 37h38l8-37"/><rect x="55" y="49" width="90" height="102" rx="25"/><path d="M100 70v32l20 13"/>',
  bag: '<path d="M39 63h122l13 112H26z"/><path d="M70 64V47a30 30 0 0160 0v17"/><path d="M61 97h78M61 125h78" opacity=".35"/>',
  shirt:
    '<path d="M65 24l35 18 35-18 45 43-27 29-17-17v98H64V79L47 96 20 67z"/><path d="M82 33q18 30 36 0"/>',
  shoe: '<path d="M25 117l21-67 35 25 18 39 44 10q35 4 39 31v14H19v-25z"/><path d="M24 152h155M62 95l27 10M58 110l40 13"/>',
  kitchen:
    '<path d="M36 69h128v77a21 21 0 01-21 21H57a21 21 0 01-21-21z"/><path d="M28 61h144M85 41h30M100 41v20M36 85H17v39h19M164 85h19v39h-19"/>',
  beauty:
    '<rect x="57" y="68" width="86" height="112" rx="20"/><path d="M75 68V44h50v24M100 44V20h57v20M76 112h48M76 130h48"/>',
  chair:
    '<path d="M49 100V44a16 16 0 0116-16h70a16 16 0 0116 16v56"/><rect x="29" y="85" width="28" height="65" rx="13"/><rect x="143" y="85" width="28" height="65" rx="13"/><path d="M57 110h86v40H57M46 150v27M154 150v27"/>',
  food: '<path d="M100 48q-35-32-62-5-26 26-6 78l27 51q18 23 41 3 23 20 41-3l27-51q20-52-6-78-27-27-62 5z"/><path d="M100 48V19q25-8 38 5-8 24-38 24"/>',
  accessory:
    '<path d="M28 54h144v106H28z"/><path d="M28 82h144M28 139h144" opacity=".3"/><rect x="114" y="90" width="70" height="40" rx="8"/><circle cx="135" cy="110" r="4"/>',
  fitness:
    '<path d="M62 85h76v30H62"/><rect x="35" y="55" width="27" height="90" rx="7"/><rect x="138" y="55" width="27" height="90" rx="7"/><rect x="17" y="72" width="18" height="56" rx="5"/><rect x="165" y="72" width="18" height="56" rx="5"/>',
  book: '<path d="M100 52q-35-25-77-15v128q42-10 77 15 35-25 77-15V37q-42-10-77 15z"/><path d="M100 52v128M43 66l37 11M43 91l37 11M120 77l37-11M120 102l37-11"/>',
  leaf: '<path d="M37 159C-7 54 79 39 167 22c20 98-5 174-92 142"/><path d="M36 184L138 55M67 145l-4-47M96 115l43 4"/>',
  bottle:
    '<path d="M78 15h44v28H78zM78 43v23l-22 30v74q0 16 16 16h56q16 0 16-16V96l-22-30V43"/><path d="M57 109h86M57 153h86" opacity=".3"/>',
};
function glyph(name: string, category: string) {
  if (/camera|webcam/i.test(name)) return "camera";
  if (/bottle|flask|serum|shampoo|lotion/i.test(name)) return "bottle";
  if (/headphone|earbud/i.test(name)) return "audio";
  if (/watch|clock/i.test(name)) return "watch";
  return (
    (
      {
        Electronics: "computer",
        Fashion: "bag",
        Clothing: "shirt",
        Footwear: "shoe",
        "Home & Kitchen": "kitchen",
        "Beauty & Personal Care": "beauty",
        Furniture: "chair",
        Grocery: "food",
        Accessories: "accessory",
        "Sports & Fitness": "fitness",
        Books: "book",
        "Eco-Friendly Products": "leaf",
      } as Record<string, string>
    )[category] || "accessory"
  );
}
const escape = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const p = products.find((p) => p.id === id);
  if (!p) return new Response("Not found", { status: 404 });
  const hash = [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 0) >>> 0;
  const hue = hash % 360;
  const color = `hsl(${hue},25%,34%)`;
  const bg = `hsl(${hue},28%,94%)`;
  const lines = p.name
    .replace(" — ", " · ")
    .match(/.{1,28}(?:\s|$)|.{1,28}/g) || [p.name];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="600" viewBox="0 0 700 600" role="img" aria-label="${escape(p.name)} — illustrative product artwork"><rect width="700" height="600" fill="${bg}"/><circle cx="350" cy="245" r="195" fill="white" opacity=".32"/><ellipse cx="350" cy="365" rx="112" ry="12" fill="${color}" opacity=".08"/><rect x="238" y="127" width="224" height="224" rx="${18 + (hash % 40)}" fill="white" opacity=".68" transform="rotate(${(hash % 11) - 5} 350 239)"/><g transform="translate(250 140)" stroke="${color}" stroke-width="4" fill="${color}" fill-opacity=".08" stroke-linecap="round" stroke-linejoin="round">${shapes[glyph(p.name, p.category)]}</g><text x="350" y="420" text-anchor="middle" font-family="Arial,sans-serif" fill="${color}" font-size="22">${lines
    .slice(0, 3)
    .map(
      (line, i) =>
        `<tspan x="350" dy="${i ? 29 : 0}">${escape(line.trim())}</tspan>`,
    )
    .join(
      "",
    )}</text><text x="350" y="550" text-anchor="middle" font-family="Arial,sans-serif" fill="${color}" opacity=".5" font-size="11" letter-spacing="2">${escape(p.id.toUpperCase())} · DEMONSTRATION ARTWORK</text></svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public,max-age=86400,stale-while-revalidate=604800",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}

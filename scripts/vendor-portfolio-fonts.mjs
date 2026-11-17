import { mkdir, writeFile } from "node:fs/promises";
const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
await mkdir("public/fonts", { recursive: true });
let stylesheet =
  "/* Self-hosted OFL fonts. License files are stored alongside them. */\n";
for (const [family, query, directory] of [
  ["Manrope", "Manrope:wght@400..800", "manrope"],
  ["Instrument Serif", "Instrument+Serif:ital@0;1", "instrumentserif"],
]) {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${query}&display=swap`,
    { headers: { "user-agent": ua } },
  );
  if (!response.ok) throw new Error(`${family} CSS: ${response.status}`);
  const text = await response.text();
  const blocks = [
    ...text.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g),
  ];
  if (!blocks.length)
    throw new Error(`${family}: latin font faces unavailable`);
  for (const [index, block] of blocks.entries()) {
    const url = block[1].match(/url\(([^)]+)\)/)[1];
    const asset = await fetch(url);
    if (!asset.ok) throw new Error(`Font download: ${asset.status}`);
    const name = `${directory}-${index}.woff2`;
    await writeFile(
      `public/fonts/${name}`,
      new Uint8Array(await asset.arrayBuffer()),
    );
    stylesheet += block[1].replace(url, `/fonts/${name}`) + "\n";
  }
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${directory}/OFL.txt`,
  );
  if (!license.ok) throw new Error(`Font license: ${license.status}`);
  await writeFile(`public/fonts/${directory}-OFL.txt`, await license.text());
}
await writeFile("public/fonts/portfolio-fonts.css", stylesheet);
console.log(
  "Manrope and Instrument Serif downloaded and self-hosted with licenses.",
);

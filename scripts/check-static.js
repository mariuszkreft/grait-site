import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../static/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../static/styles.css", import.meta.url), "utf8");
const js = await readFile(new URL("../static/app.js", import.meta.url), "utf8");

for (const [name, content] of [
  ["index.html", html],
  ["styles.css", css],
  ["app.js", js],
]) {
  if (!content.trim()) throw new Error(`${name} is empty`);
}

for (const needle of ["Forward Deployed Engineer", "hello@grait.io", "deployment-map"]) {
  if (!html.includes(needle)) throw new Error(`Missing expected content: ${needle}`);
}

if (!css.includes("@media (max-width: 560px)")) {
  throw new Error("Missing mobile responsive styles");
}

if (!js.includes("requestAnimationFrame")) {
  throw new Error("Deployment map animation is not wired");
}

console.log("static checks passed");

const esbuild = require("esbuild");
const isDev = process.argv[2] === "dev";
console.log("Building for " + (isDev ? "development" : "production") + "...");
esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "scripts/index.js",
  minify: !isDev,
  platform: "neutral",
  watch: isDev,
  external: [
    "mojang-minecraft",
    "mojang-minecraft-ui",
    "mojang-gametest",
    "mojang-net",
    "mojang-minecraft-server-admin",
  ],
  legalComments: isDev ? "none" : "none",
});

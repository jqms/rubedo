const esbuild = require("esbuild");
const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");
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
  legalComments: isDev ? "none" : "eof",
});

// fs.readFile("./scripts/index.js", (err, inputD) => {
//   if (err) throw err;
//   fs.writeFile(
//     "./scripts/index.js",
//     JavaScriptObfuscator.obfuscate(inputD.toString(), {
//       compact: false,
//       controlFlowFlattening: true,
//       controlFlowFlatteningThreshold: 1,
//       numbersToExpressions: true,
//       simplify: true,
//       stringArrayShuffle: true,
//       splitStrings: true,
//       stringArrayThreshold: 1,
//     }).getObfuscatedCode(),
//     (err) => {}
//   );
// });

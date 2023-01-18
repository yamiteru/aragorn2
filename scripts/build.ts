import { build, BuildOptions } from "esbuild";
import { Generator } from "npm-dts";
import { source, main as cjs, module as esm, types } from "../package.json";

const shared: BuildOptions = {
  bundle: true,
  entryPoints: [source],
  logLevel: "info",
  minify: true,
  sourcemap: true,
  platform: "node",
};

const buildEsm = () =>
  build({
    ...shared,
    format: "esm",
    outfile: esm,
    target: ["esnext", "chrome97"],
  });

const buildCjs = () =>
  build({
    ...shared,
    format: "cjs",
    outfile: cjs,
    target: ["esnext", "chrome97"],
  });

const buildTypes = () =>
  new Generator({
    entry: source,
    output: types,
  }).generate();

(async () => {
  await Promise.all([buildEsm(), buildCjs(), buildTypes()]);
})();

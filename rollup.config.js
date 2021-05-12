import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.tsx",
  output: {
    file: "./dist/bundle.js",
  },
  plugins: [
    resolve({ browser: true }),
    commonjs({
      transformMixedEsModules: true,
    }),
    typescript({
      noEmitOnError: true,
    }),
    html({ title: "yt-compilation-creator" }),
    replace({ "process.env.NODE_ENV": JSON.stringify("DEV") }),
  ],
};

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "@rollup/plugin-typescript";
import html from "@rollup/plugin-html";
import replace from "@rollup/plugin-replace";

export default {
    input: "./src/index.tsx",
    output: {
        file: "./dist/bundle.js",
    },
    plugins: [
        resolve({browser:true}),
        commonjs({
            transformMixedEsModules: true
        }),
        typescript(),
        html(),
        replace({'process.env.NODE_ENV': JSON.stringify('DEV')})
    ]
};

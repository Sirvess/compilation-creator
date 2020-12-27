import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

import rollupConfig from "./rollup.config.js";

export default {
    ...rollupConfig,
    plugins: [
        ...rollupConfig.plugins,
        serve('dist'),
        livereload()
    ]
};

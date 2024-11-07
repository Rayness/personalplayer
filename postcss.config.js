const path = require('path');

const cssRoot = path.resolve(__dirname, './css');

module.exports = {
    plugins: [
        [
            'postcss-import',
            {
                resolve(pathName) {
                    let pathNameResolved = pathName.match(/\.scss$/)
                        ? pathName
                        : `${pathName}.scss`;

                    if (/^\/css/.test(pathNameResolved)) {
                        pathNameResolved = `${cssRoot}${pathNameResolved.slice(4)}`;
                    }
                    return pathNameResolved;
                },
            },
        ],
        'postcss-mixins',
        'postcss-nested',
        'postcss-simple-vars',
        'postcss-calc',
        'postcss-svgo',
        'precss',
        'postcss-flexbugs-fixes',
        'autoprefixer',
        'postcss-focus-within',
    ],
};
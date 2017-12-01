// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    plugins: {
        // to edit target browsers: use "browserslist" field in package.json
        "postcss-import": {},
        autoprefixer: {
            browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "postcss-filter-gradient": {}
    }
};

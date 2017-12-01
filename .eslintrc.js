// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: "babel-eslint",
    parserOptions: {
        sourceType: "module"
    },
    env: {
        browser: true
    },
    extends: ["vue", "airbnb-base"],
    // required to lint *.vue files
    plugins: ["html", "flowtype-errors"],
    // check if imports actually resolve
    settings: {
        "import/resolver": {
            webpack: {
                config: "build/webpack.base.conf.js"
            }
        }
    },
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        "import/extensions": [
            "error",
            "always",
            {
                js: "never",
                vue: "never"
            }
        ],
        // allow optionalDependencies
        "import/no-extraneous-dependencies": [
            "error",
            {
                optionalDependencies: ["test/unit/index.js"]
            }
        ],
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
        "no-console": process.env.NODE_ENV === "production" ? 2 : 0,
        indent: ["error", 4],
        "comma-dangle": [2, "never"],
        quotes: [2, "double", "avoid-escape"],
        "eol-last": 0,
        "flowtype-errors/show-errors": 2,
        "no-shadow": 0,
        "no-param-reassign": [2, { props: false }],
        "arrow-parens": [0, "always"],
        "import/prefer-default-export": 0,
        "space-before-function-paren": 0,
        "func-names": 0,
        "no-param-reassign": 0
    }
};

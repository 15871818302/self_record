const path = require("path");

const RULE_NAME = "no-js-in-ts-project";

const JS_REG = /\.jsx?$/;

const DEFAULT_WHITE_LIST = [
  "commit.config.js",
  "eslintrc.js",
  "prettierrc.js",
  "stylelintrc.js",
]

module.exports = {
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    fixable: null,
    messages: {
      noJsInTsProject: "Recommended to use `.ts` or `.tsx` extension",
    }
  },
  create(context) {
    const fileName = context.getFilename();
    const extName = path.extname(fileName);
    const ruleOptions = context.options[0] || {};
    let { whitelist = [], autoMerge = true } = ruleOptions
    if (!whitelist.length) {
      whitelist = DEFAULT_WHITE_LIST
    } else if (autoMerge) {
      whitelist = [...new Set([...DEFAULT_WHITE_LIST, ...whitelist])]
    }

    const whiteListReg = new RegExp(`^${whitelist.join("|")}$`)

    if (!whiteListReg.test(fileName) && JS_REG.test(extName)) {
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          }
        },
        messageId: "noJsInTsProject",
        data: {
          fileName,
        }
      })
    }

    return {}
  }
}
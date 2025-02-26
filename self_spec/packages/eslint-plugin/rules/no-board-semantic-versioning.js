const path = require("path");

const RULE_NAME = "no-board-semantic-versioning";

module.exports = {
  name: RULE_NAME,
  meta: {
    type: "problem",
    fixable: null,
    messages: {
      noBoardSemanticVersioning:
        'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
    },
  },

  create(context) {
    if (path.basename(context.getFilename()) !== "package.json") {
      return {};
    }

    const cwd = context.getCwd();

    return {
      Property: function handleRequires(node) {
        if (
          node.key &&
          node.key.value &&
          (node.key.value === "dependencies" ||
            node.key.value === "devDependencies") &&
          node.value &&
          node.value.properties
        ) {
          node.value.properties.forEach((property) => {
            if (property.key && property.key.value) {
              const dependencyName = property.key.value;
              const versioning = property.value.value;

              if (
                dependencyName.startsWith("@board/") &&
                versioning.startsWith("^")
              ) {
                context.report({
                  loc: property.loc,
                  messageId: "noBoardSemanticVersioning",
                  data: {
                    dependencyName,
                    versioning,
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};

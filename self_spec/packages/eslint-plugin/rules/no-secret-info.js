const RULE_NAME = "no-secret-info";

const DEFAULT_DANGEROUS_KEYS = ["password", "secret", "token", "apiKey"];

module.exports = {
  meta: {
    type: "problem",
    fixable: null,
    messages: {
      noSecretInfo:
        'Detect that the "{{secret}}" might be secret token, please check it.',
    },
  },

  create(context) {
    const ruleOptions = context.options[0] || {};
    let { dangerousKeys = [], autoMerge = true } = ruleOptions;
    if (dangerousKeys.length === 0) {
      dangerousKeys = DEFAULT_DANGEROUS_KEYS;
    } else if (autoMerge) {
      dangerousKeys = [
        ...new Set([...DEFAULT_DANGEROUS_KEYS, ...dangerousKeys]),
      ];
    }

    const reg = new RegExp(dangerousKeys.join("|"));

    return {
      Literal: function handleRequires(node) {
        if (
          node.value &&
          node.parent &&
          ((node.parent.type === "VariableDeclarator" &&
            node.parent.id &&
            node.parent.id.name &&
            reg.test(node.parent.id.name.toLowerCase())) ||
            (node.parent.type === "Property" &&
              node.parent.key &&
              node.parent.key.name &&
              reg.test(node.parent.key.name.toLowerCase())))
        ) {
          context.report({
            node,
            messageId: "noSecretInfo",
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};

const assert = require("assert");
const stylelint = require("stylelint");
const path = require("path");

describe("test/rules-validate.test.js", () => {
  it("validate default", async () => {
    const filePaths = [path.join(__dirname, "./fixtures/index.css")]

    const result = await stylelint.lint({
      configFile: path.join(__dirname, "../index.js"),
      files: filePaths,
      fix: false,
    })

    if (result && result.errored) {
      const filesResult = JSON.parse(result.output || "[]") || []
      filesResult.forEach(filesResult => {
        console.log(`========== ${filesResult.filePath} ==========`);
        console.log(filesResult.warnings);
      });

      assert.ok(filesResult.length !== 0)
    }
  })
})

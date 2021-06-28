const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document, position, token) {
  const fileName = document.fileName;
  const workDir = path.dirname(fileName);
  const word = document.getText(document.getWordRangeAtPosition(position));//获取光标位置文本

  if (/\/package\.json$/.test(fileName)) {
    console.log("进入provideHover方法");
    const json = document.getText();//获取json文件内容
    if (
      new RegExp(
        `"(dependencies|devDependencies)":\\s*?\\{[\\s\\S]*?${word.replace(
          /\//g,
          "\\/"
        )}[\\s\\S]*?\\}`,
        "gm"
      ).test(json)
    ) {
      let jsonDir = `${workDir}/node_modules/${word.replace(
        /"/g,
        ""
        )}/package.json`;
      if (fs.existsSync(jsonDir)) {
        const json = fs.readFileSync(jsonDir, "utf8");
        const josnObj = JSON.parse(json);
        // hover内容支持markdown语法
        return new vscode.Hover(
          `* **名称1**：${josnObj.name}\n* **版本1**：${josnObj.version}\n* **许可协议1**：${josnObj.license}\n* **吃了吗**：1111`
        );
      }
    }
  }
}

module.exports = function (context) {
  // 注册鼠标悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("json", {
      provideHover,
    })
  );
};

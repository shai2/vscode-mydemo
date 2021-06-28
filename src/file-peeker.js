const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

var myConfig = vscode.workspace.getConfiguration("KaiyiVscodeDemo");
// 后缀
var fileSearchExtensions = [".js", ".ts", ".html", ".css", ".scss"];

// console.log("---------------------");
// console.log("myConfig", myConfig);
// console.log("---------------------");
// vscode.languages.getLanguages().then((languages) => {
//   console.log("vscode支持语言: " + languages);
// });

/**
 * 拼接完整查找路径
 * @param {*} lookupPath 文件完成路径
 * @returns 
 */

function getPotentialPaths(lookupPath) {
  var _arr = [];
  // 文件路径+n种扩展名，拼成查询数组
  // path.parse(xxx)，把完成路径拆解成对象。文档: nodejs.cn/api/path/path_parse_path.html
  var pathObj = path.parse(lookupPath);
  console.log("pathObj", pathObj);
  fileSearchExtensions.forEach((e) => {
    // path.format() 与 path.parse() 相反，生成路径字符串
    // 注意：提供 pathObject.dir 忽略 pathObject.root; 提供pathObject.base 忽略 pathObject.ext、pathObject.name
    var pathString = path.format({
      base: pathObj.name + e,
      dir: pathObj.dir,
      ext: e,
      name: pathObj.name,
      root: pathObj.root,
    });
    _arr.push(pathString);
    // 再拼接一遍补全xxx/index的，防止import的是文件夹名，省略了/index.js等
    var pathString2 = path.format({
      base: pathObj.name + '/index' + e,
      dir: pathObj.dir,
      ext: e,
      name: pathObj.name,
      root: pathObj.root,
    });
    _arr.push(pathString2);
  });
  
  // 更简单方式，只适合当前简单规则：直接拼接 完整路径 + 后缀
  // fileSearchExtensions.forEach((e) => {
  //   _arr.push(lookupPath + e);
  // });

  console.log("_arr", _arr);
  return _arr;
};

function provideDefinition(document, position, token) {
  var workDir = path.dirname(document.fileName); //拿到文件路径，不算文件本身
  var word = document.getText(document.getWordRangeAtPosition(position)); // 当前光标所在单词
  var line = document.lineAt(position); // 当前光标所在行
  // 拿到光标本行 正则匹配"xxx"和'xxx'
  var match = line.text.match(new RegExp(`["'](.*?${word}.*?)["']`));
  console.log("匹配结果: ", match);

  if (null !== match) {
    var filePath = match[1];
    var matchStart = match.index;
    var matchEnd = match.index + filePath.length;
    // 验证光标在匹配字符串内，例如 import a from './a' 只在鼠标放在'./a'时生效，而不是a，更不是import
    if (position.character >= matchStart && position.character <= matchEnd) {
      // 拼接 打开文件工作路径 + 引入文件路径
      var fullPath = path.resolve(workDir, filePath);
      console.log("完整路径: " + fullPath);
      // 拿到所有查找的路径
      var findPathArr = getPotentialPaths(fullPath);
      // 匹配第一个路径
      var item = findPathArr.find((e) => {
        return fs.existsSync(e);
      });
      if (null !== item) {
        console.log("found: " + item);
        return new vscode.Location(
          vscode.Uri.file(item),
          new vscode.Position(0, 1)
        );
      }
    }
  }
  return null;
};

// 可以简写成 var peekFilter = ["typescript", "javascript"];
var peekFilter = ["typescript", "javascript"].map((e) => {
  return {
    language: e,
    scheme: "file",
  };
});

module.exports = function (context) {
  // 注册
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      peekFilter,
      {
        provideDefinition
      }
    )
  );
};

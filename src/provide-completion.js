const vscode = require('vscode');
const util = require('./util');
const path = require('path');
const fs = require('fs');
import { EventEmitter } from 'events';
// const emitter = new EventEmitter();

/**
 * demo里自带的: 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document
 * @param {*} position
 * @param {*} token
 * @param {*} context
 */
// function provideCompletionItems(document, position, token, context) {
//   const line = document.lineAt(position);
//   const projectPath = util.getProjectPath(document);
//   // 只截取到光标位置为止
//   const lineText = line.text.substring(0, position.character + 1);
//   // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
//   if (/(^|=| )\w+\.dependencies\.$/g.test(lineText)) {
//     // todo:没有这个文件，递归搜索文件夹?
//     const jsonDir = `${path.dirname(projectPath)}/package.json`;
//     console.log('目标目录', jsonDir);
//     // 这里如果不用fs.read，直接require(jsonDir)会有错不生效
//     const json = fs.readFileSync(jsonDir, 'utf8');
//     const jsonObj = JSON.parse(json);
//     const dependencies = Object.keys(jsonObj.dependencies || {}).concat(
//       Object.keys(jsonObj.devDependencies || {})
//     );
//     const res = dependencies.map((e) => {
//       // vscode.CompletionItemKind 表示提示的类型
//       return new vscode.CompletionItem(e, vscode.CompletionItemKind.Field);
//     });
//     console.log('res', res);
//     return res;
//   }
// }

// vscode.workspace.onDidChangeTextDocument((e) =>
//   emitter.emit('textChanged')
// );

// 改import相关
function provideCompletionItems2(document, position, token, context) {
  const line = document.lineAt(position);
  const projectPath = util.getProjectPath(document);
  const currentFile = (document.uri ? document.uri : document).fsPath;
  // 只截取到光标位置为止
  const lineText = line.text;
  let arr = lineText.match(/^import.*from(.*)/);
  console.log('-------------------------！');
  console.log('line======>', lineText, projectPath, arr);
  if (arr && arr.length > 1) {
    console.log('目标文件=====>', arr[1]);
    let searchText = arr[1].replace(/^\W*/, '').replace(/\W*$/, '');
    console.log('searchText=====>', searchText);
    // 始递归搜索文件夹
    let baseDir = path.dirname(projectPath);
    console.log('baseDir=====>', baseDir);
    let fileList = util.readFileList(baseDir);
    let filterList = fileList.filter((e) =>
      e.replace(/^.*\//, '').includes(searchText)
    );
    console.log('筛选后文件=====>', filterList);
    console.log('-------------------------！');
    const tipArr = filterList.map((e) => {
      let reltivePath = util.relativeDir(e, currentFile);
      console.log(1111111, currentFile, e, reltivePath);
      // vscode.CompletionItemKind 表示提示的类型
      return new vscode.CompletionItem(
        reltivePath,
        vscode.CompletionItemKind.Field
      );
    });
    console.log('tipArr', tipArr);
    return tipArr;
  }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item, token) {
  return null;
}
// TODO:不生效
module.exports = function (context) {
  // 注册代码建议提示，只有当按下“.”时才触发
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      ['typescript', 'javascript', 'vue', 'react'],
      {
        provideCompletionItems: provideCompletionItems2,
        resolveCompletionItem,
      },
      ['s', 'v']
    )
  );
};

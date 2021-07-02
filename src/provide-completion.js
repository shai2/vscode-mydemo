const vscode = require('vscode');
const util = require('./util');
const path = require('path');

// 改import相关
function provideCompletionItems2(document, position, token, context) {
  const line = document.lineAt(position);
  const projectPath = util.getProjectPath(document);
  const currentFile = (document.uri ? document.uri : document).fsPath;
  // 只截取到光标位置为止
  const lineText = line.text;
  let arr = lineText.match(/^import.*from(.*)/);
  if (arr && arr.length > 1) {
    let searchText = arr[1].replace(/^\W*/, '').replace(/\W*$/, '');
    // 始递归搜索文件夹
    let baseDir = path.dirname(projectPath);
    let fileList = util.readFileList(baseDir);
    let filterList = fileList.filter((e) =>
      e.replace(/^.*\//, '').includes(searchText)
    );
    const tipArr = filterList.map((e) => {
      let reltivePath = util.relativeDir(e, currentFile);
      // vscode.CompletionItemKind 表示提示的类型
      return new vscode.CompletionItem(
        reltivePath,
        vscode.CompletionItemKind.Field
      );
    });
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

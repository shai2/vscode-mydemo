const vscode = require('vscode');
const util = require('./util');
const path = require('path');
const fs = require('fs');

// 改import相关
function provideCompletionItems2(document, position, token, context) {
  console.log('------provideCompletionItems2-------------------！');
  const line = document.lineAt(position);
  const projectPath = util.getProjectPath(document);
  const currentFile = (document.uri ? document.uri : document).fsPath;
  // 只截取到光标位置为止
  const lineText = line.text;
  let arr = lineText.match(/^import.*from.*(\w+)/);
  console.log('-------------------------！');
  console.log('line=====>', lineText, projectPath, arr);
  if (arr && arr?.[1]) {
    console.log('目标文件=====>', arr[1]);
    let searchText = arr[1].replace(/^\W*/, '').replace(/\W*$/, '');
    console.log('searchText=====>', searchText);
    // 始递归搜索文件夹
    let baseDir = path.dirname(projectPath);
    console.log('baseDir=====>', baseDir);
    let fileList = util.readFileList(baseDir);
    console.log('fileList=====>', fileList);
    let alians = [];
    let filterList = fileList.filter((e) => {
      if (e.includes('.umirc')) {
        const txt = fs.readFileSync(e, 'utf-8');
        const _arr = txt.match(/alias:.*?{((.|\r|\n)*?)\},/);
        if (_arr.length > 1) {
          alians = _arr[1]
            .replace(/(\r|\n|\s|')/g, '')
            .split(',')
            .filter((e) => !!e)
            .map((e) => {
              let _item = e.split(':');
              _item[1] = _item[1].match(/\w+.*/)?.[0];
              return _item;
            });
        }
      }
      // e.replace(/^.*\//, '').includes(searchText)
      return e.includes(searchText);
    });
    console.log('alians=====>', alians);
    console.log('筛选后文件=====>', filterList);
    console.log('-------------------------！');
    const tipArr = filterList.map((e) => {
      let reltivePath = util.relativeDir(e, currentFile);
      // console.log(1111111, currentFile, e, reltivePath);
      // 替换alians
      alians.forEach((m) => {
        const _reg = new RegExp(`.*${m[1]}`, 'g');
        if (e.includes(m[1])) {
          reltivePath = e.replace(_reg, `@/${m[0]}`);
          // console.log(
          //   '匹配到了',
          //   e,
          //   reltivePath,
          //   reltivePath.replace(_reg, `@/${m[0]}`)
          // );
        }
      });
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
const fileType = [
  'vue',
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
  'css',
  'less',
  'scss',
  'sass',
  'stylus',
  'plaintext',
];

module.exports = function (context) {
  fileType.map((e) =>
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        e,
        {
          provideCompletionItems: provideCompletionItems2,
          resolveCompletionItem,
        },
        ['s', 'v']
      )
    )
  );
};

// module.exports = function (context) {
//   context.subscriptions.push(
//     vscode.languages.registerCompletionItemProvider(
//       'vue',
//       {
//         provideCompletionItems: provideCompletionItems2,
//         resolveCompletionItem,
//       },
//       ['s', 'x']
//     )
//   );
// };

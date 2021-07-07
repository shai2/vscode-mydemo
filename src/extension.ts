// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
exports.activate = (context: any) => {
  console.log('-----------------------------------------------');
  console.log('Congratulations, your extension "vscode-mydemo" is now active!');
  console.log('-----------------------------------------------');
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-mydemo.helloWorld', () => {
      vscode.window.showInformationMessage('吃了吗');
    })
  );
  // 获取文件路径getCurrentFilePath
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-mydemo.aaaaaaaaaaaaaa',
      (uri: any) => {
        console.log(uri, uri);
        vscode.window.showInformationMessage(
          `当前文件(夹)路径是：${uri ? uri.path : '空'}`
        );
      }
    )
  );
  // 打开文件
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-mydemo.bbbbbbbbbbbbbb', () => {
      let uri = vscode.Uri.file(
        '/Users/shai2/飞书深诺项目/cm_web/src/pages/enter_manage/remittance/services/index.js'
      );
      vscode.commands
        .executeCommand('vscode.openFolder', uri)
        .then((res: any) => {
          console.log(res);
        });
    })
  );
  // 跳转到定义，只对package.json生效
  require('./jump-to-definition')(context);
  // 自动补全代码
  require('./provide-completion')(context);
  // 自定义hover悬停提示，只对dependencies、devDependencies生效
  require('./provide-hover')(context);
  // 抄file-peeker，点import..xxx..from...xxx跳转到文件定义
  // require('./file-peeker')(context);
  // webview
  require('./webview')(context);
};

// this method is called when your extension is deactivated
exports.deactivate = () => {};

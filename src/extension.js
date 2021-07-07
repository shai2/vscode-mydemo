// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
exports.activate = (context) => {
  console.log('“vscode-mydemo”激活');
  // 自动补全代码
  require('./provide-completion')(context);

  // helloWorld
  let disposable = vscode.commands.registerCommand(
    'vscode-myplugin.helloWorld',
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from vscode-myplugin!');
    }
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
exports.deactivate = () => {};

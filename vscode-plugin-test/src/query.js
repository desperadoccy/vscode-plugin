const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const util = require('./util');

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
    const resourcePath = util.getExtensionFileAbsolutePath(context, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src="|<iframe.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    html = html.replace("cur: '0.0'","cur: 'Demo'");
//  html = html.replace("$('#value').value=undefined","$('#value').value="+context);
    return html;
}
module.exports = function(context) {
    // 注册query命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.query', () => {
        vscode.window.showInputBox(
            { // 这个对象中所有参数都是可选参数
                password:false, // 输入内容是否是密码
                ignoreFocusOut:true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
                placeHolder:'Please Input your Query', // 在输入框内的提示信息
                prompt:'code recommendation', // 在输入框下方的提示信息
                //validateInput:function(text){return text;} // 对输入内容进行验证并返回
            }).then(function(msg){
                const panel = vscode.window.createWebviewPanel(
                    'testWebview', // viewType
                    "Code Snippets Recommendation", // 视图标题
                    vscode.ViewColumn.One, // 显示在编辑器的哪个部位
                    {
                        enableScripts: true, // 启用JS，默认禁用
                        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
                    }
                );
                //let global = { projectPath, panel};
                //panel.webview.html = getWebViewContent(context, 'src/view/test-webview.html');
                panel.webview.html = getWebViewContent(context, 'src/view/index.html');
        });
    }));
};
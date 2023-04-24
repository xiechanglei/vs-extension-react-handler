
const vscode = require('vscode')
const fs = require('fs')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	let disposable = vscode.commands.registerCommand('react-handler.js-less', function (uri) {
		if (uri != null) {
			let path = uri.path;
			let isDirectory = false;
			try {
				isDirectory = fs.statSync(path).isDirectory();
			} catch (error) {
				path = uri.path.substr(1);
				isDirectory = fs.statSync(path).isDirectory();
			}
			if(isDirectory){
				vscode.window.showInputBox({
					ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
					placeHolder: 'The name of component', // 在输入框内的提示信息
					prompt: 'Input the component name'
				}).then(function (componentName) {
					createComponent(path, componentName)
				});
			}
		}
	});

	context.subscriptions.push(disposable);
}

function createComponent(path, component) {
	if(component == undefined){
		return
	}
	let pathStat = fs.statSync(path);
	if(pathStat.isFile()){
		vscode.window.showInformationMessage(`${path} is a file , please use folder.`,'sure');
		return
	}
	path = path + "/" + component;
	if (fs.existsSync(path)) {
			vscode.window.showInformationMessage(`${path} is exists.`,'sure');
	} else {
		fs.mkdirSync(path)
		fs.writeFile(`${path}/index.module.less`, 
`.componentWraper {
  :global {
  }
}`, () => { })
		fs.writeFile(`${path}/index.js`,
			`import { Component } from 'react'

import style from './index.module.less'

export class ${component} extends Component {
	static defaultProps = {
		className: "",
		onClick: () => { }
	}

	render() {
		let { className, onClick } = this.props
		return (
			<div className={\`\${style.componentWraper} \${className}\`} onClick={onClick}></div>
		)
	}
}`, () => { })
	}


}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}

import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';

const codeTimer = new CodeTimer();


export function activate(context: vscode.ExtensionContext) {
	const fileOperator = new FileOperator(context);
	codeTimer.init(fileOperator);
	

	let disposable = vscode.commands.registerCommand(
		'codegroove.runCodegroove',
		() => {
			vscode.window.showInformationMessage('You are running codegroove!');
		},
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {
	codeTimer.dispose();
}

import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';

const codeTimer = new CodeTimer();


export function activate(context: vscode.ExtensionContext) {
	codeTimer.init();
	const fileOperator = new FileOperator(context);

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

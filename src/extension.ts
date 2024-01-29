import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';

const codeTimer = new CodeTimer();

export function activate(context: vscode.ExtensionContext) {
	codeTimer.init();

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

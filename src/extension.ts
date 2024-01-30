import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';
import { StatsGenerator } from './StatsGenerator';

const codeTimer = new CodeTimer();

export function activate(context: vscode.ExtensionContext) {
	const fileOperator = new FileOperator(context);
	const statsGenerator = new StatsGenerator();
	codeTimer.init(fileOperator);
	statsGenerator.init(context);

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

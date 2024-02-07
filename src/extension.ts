import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';
import { StatsGenerator } from './StatsGenerator';

let codeTimer: any;
let fileOperator;

export function activate(context: vscode.ExtensionContext) {
	codeTimer = new CodeTimer();
	fileOperator = new FileOperator(context);
	const statsGenerator = new StatsGenerator(context, fileOperator);
	codeTimer.init(fileOperator);
	statsGenerator.init();

	let disposable = vscode.commands.registerCommand(
		'codegroove.runCodegroove',
		() => {
			vscode.window.showInformationMessage('You are running codegroove!');
		},
	);

	context.subscriptions.push(disposable);
}

export async function deactivate() {
	await codeTimer.dispose();
}

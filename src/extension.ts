import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';
import { StatsGenerator } from './StatsGenerator';
import { FileOperatorInstance } from './types';

let codeTimer: CodeTimer;
let fileOperator: FileOperatorInstance;

export function activate(context: vscode.ExtensionContext) {
	codeTimer = new CodeTimer(fileOperator);
	fileOperator = new FileOperator(context);
	codeTimer.init(fileOperator);

	let disposable = vscode.commands.registerCommand(
		'codegroove.showStats',
		() => {
			vscode.window.showInformationMessage(
				'You will see stats in new tab!',
			);
			const statsGenerator = new StatsGenerator(context, fileOperator);
			statsGenerator.init();
		},
	);

	context.subscriptions.push(disposable);
}

export async function deactivate() {
	await codeTimer.dispose();
}

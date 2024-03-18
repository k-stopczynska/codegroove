import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';
import { StatsGenerator } from './StatsGenerator';
import { Config } from './Config';
import { FileOperatorInstance } from './types';

let codeTimer: CodeTimer;
let fileOperator: FileOperatorInstance;

/**
 * creates CodeTimer and FileOperator instances on initialization,
 * registers "show stats" command for creating and initializing StatsGenerator instance
 * @param context vs code context where the extension is stored
 */

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

	disposable = vscode.commands.registerCommand(
		'codegroove.pickInactivityTime',
		() => {
			vscode.window.showInformationMessage(
				'You will be able to pick your inactivity time!',
			);
			const config = new Config();
		},
	);

	context.subscriptions.push(disposable);
}

/**
 * disposes the codeTimer instance on deactivation
 */

export async function deactivate() {
	await codeTimer.dispose();
}

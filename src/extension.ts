import * as vscode from 'vscode';
import { CodeTimer } from './CodeTimer';
import { FileOperator } from './FileOperator';
import { StatsGenerator } from './StatsGenerator';
import { Config } from './Config';
import { Groove } from './Groove';
import { FileOperatorInstance } from './types';

let codeTimer: CodeTimer;
let fileOperator: FileOperatorInstance;

/**
 * creates CodeTimer and FileOperator instances on initialization,
 * registers "show stats" command for creating and initializing StatsGenerator instance
 * registers "pick inactivity time" command for creating Config class instance
 * @param context vs code context where the extension is stored
 */

export function activate(context: vscode.ExtensionContext) {
	codeTimer = new CodeTimer(fileOperator);
	fileOperator = new FileOperator(context);
	codeTimer.init(fileOperator);

	let disposable = vscode.commands.registerCommand(
		'codegroove.showStats',
		() => {
			const statsGenerator = new StatsGenerator(context, fileOperator);
			statsGenerator.init();
		},
	);

	disposable = vscode.commands.registerCommand(
		'codegroove.pickInactivityTime',
		() => {
			const config = new Config();
		},
	);

	disposable = vscode.commands.registerCommand(
		'codegroove.playGroove',
		() => {
			const groove = new Groove(context);
			groove.init();
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

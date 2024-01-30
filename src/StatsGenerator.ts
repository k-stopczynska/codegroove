import * as vscode from 'vscode';

export class StatsGenerator {
	webView = vscode.window.createWebviewPanel(
		'codeTimerStats',
		'Code Timer Stats',
		vscode.ViewColumn.One,
		{},
	);
}

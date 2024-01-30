import * as vscode from 'vscode';

export class StatsGenerator {
	panel = vscode.window.createWebviewPanel(
		'codeTimerStats',
		'Code Timer Stats',
		vscode.ViewColumn.One,
		{},
	);
	context: any;

	init(context: any) {
		this.context = context;
		this.panel.webview.html = this.getWebviewContent();
	}

	getWebviewContent() {
		const onDiskPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'assets',
			'codegroove.png',
		);

		const logoSrc = this.panel.webview.asWebviewUri(onDiskPath);

		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Code Timer Stats</title>
            </head>
            <body>
                <img src="${logoSrc}" width="300" />
            </body>
            </html>`;
	}
}

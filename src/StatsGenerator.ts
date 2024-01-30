import * as vscode from 'vscode';

export class StatsGenerator {
	panel = vscode.window.createWebviewPanel(
		'codeTimerStats',
		'Code Timer Stats',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
		},
	);
	context: any;

	init(context: any) {
		this.context = context;
		this.panel.webview.html = this.getWebviewContent();
		console.log(
			vscode.Uri.joinPath(this.context.extensionUri, 'stats.json'),
		);
	}

	getWebviewContent() {
		const logoPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'assets',
			'codegroove.png',
		);
		const logoSrc = this.panel.webview.asWebviewUri(logoPath);

		const stylePath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'src',
			'styles.css',
		);
		const styleSrc = this.panel.webview.asWebviewUri(stylePath);

		const scriptPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'src',
			'charts.js',
		);
		const scriptSrc = this.panel.webview.asWebviewUri(scriptPath);

		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${styleSrc}">
                <script src="${scriptSrc}" defer></script>
                <title>Code Timer Stats</title>
            </head>
            <body>
                <nav>
                    <img src="${logoSrc}" width="100" />
                    <h1>codegroove stats</h1>
                </nav>
            </body>
            </html>`;
	}
}

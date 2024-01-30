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
		console.log(
			vscode.Uri.joinPath(this.context.extensionUri, 'stats.json'),
		);
	}

	getWebviewContent() {
		const onDiskPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'assets',
			'codegroove.png',
        );
        
        const stylePath = vscode.Uri.joinPath(this.context.extensionUri, 'src', 'styles.css');

        const logoSrc = this.panel.webview.asWebviewUri(onDiskPath);
        
        const styleSrc = this.panel.webview.asWebviewUri(stylePath);

		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${styleSrc}">
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

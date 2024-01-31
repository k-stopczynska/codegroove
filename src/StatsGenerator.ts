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
                <script src="
https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
"></script>
                <script src="${scriptSrc}" defer type="module"></script>

                <title>Code Timer Stats</title>
            </head>
            <body>
                <nav class="nav__container">
                    <img src="${logoSrc}" width="100" />
                    <h1>codegroove stats</h1>
                </nav>
                <main>
                    <section class="section__container">
                        <div class="chart">
                            <canvas id="chart1"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart2"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart3"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart4"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart5"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart6"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart7"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart8"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart9"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart10"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart11"></canvas>
                        </div>
                             <div class="chart">
                            <canvas id="chart12"></canvas>
                        </div>
                       
    
                    </section>
                </main>
            </body>
            </html>`;
	}
}

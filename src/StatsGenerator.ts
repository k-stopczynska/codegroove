import * as vscode from 'vscode';
import { Session } from './types';

export class StatsGenerator {
	panel = vscode.window.createWebviewPanel(
		'codeTimerStats',
		'Code Timer Stats',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
		},
	);
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	init() {
		this.panel.webview.html = this.getWebviewContent();
		this.fetchData();
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
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
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

	async fetchData() {
		const dataPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'stats.json',
		);

		try {
			const content = await vscode.workspace.fs.readFile(dataPath);
			const contentString = Buffer.from(content).toString();
			const jsonData = JSON.parse(contentString);
			const sessions = this.filterDates(jsonData);

			// const chartsHtml = this.generateChartsHtml(jsonData);
			// this.panel.webview.html = chartsHtml;

			const durations =
				sessions.map((session) => this.getDurationPerProjectAndPerLanguage(session));

			console.log(durations);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	getCurrentTime() {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const currTime = date.toLocaleString('en-US', { timeZone: timeZone });
		return currTime;
	}

	filterDates(data: Session[]) {
		const currTime = this.getCurrentTime();
        const splitted = currTime.split('/');
        
		const dailySessions = data.filter(
			(data) => data.start.split('/')[1] === splitted[1],
		);
		const monthlySessions = data.filter(
			(data) => data.start.split('/')[0] === splitted[0],
		);
		const yearlySessions = data.filter(
			(data) =>
				data.start.split('/')[2].split(',')[0] ===
				splitted[2].split(',')[0],
		);
		return [dailySessions, monthlySessions, yearlySessions];
	}

	getDurationPerProjectAndPerLanguage(data: Session[]) {
		const durationPerProject: any = {};
		const durationPerLanguage: any = {};
		data.forEach((entry: Session) => {
			const totalSeconds =
				+entry.duration.hours * 3600 +
				+entry.duration.minutes * 60 +
				entry.duration.seconds;

			if (!durationPerProject[entry.project]) {
				durationPerProject[entry.project] = 0;
			}
			durationPerProject[entry.project] += totalSeconds;

			if (!durationPerLanguage[entry.language]) {
				durationPerLanguage[entry.language] = 0;
			}
			durationPerLanguage[entry.language] += totalSeconds;
		});
		return [durationPerProject, durationPerLanguage];
	}

	// 	generateChartsHtml(data: any) {
	// 		const logoPath = vscode.Uri.joinPath(
	// 			this.context.extensionUri,
	// 			'assets',
	// 			'codegroove.png',
	// 		);
	// 		const logoSrc = this.panel.webview.asWebviewUri(logoPath);

	// 		const stylePath = vscode.Uri.joinPath(
	// 			this.context.extensionUri,
	// 			'src',
	// 			'styles.css',
	// 		);
	// 		const styleSrc = this.panel.webview.asWebviewUri(stylePath);

	// 		const chartScriptPath = vscode.Uri.joinPath(
	// 			this.context.extensionUri,
	// 			'src',
	// 			'charts.js',
	// 		);
	// 		const chartScriptSrc = this.panel.webview.asWebviewUri(chartScriptPath);

	// 		const chartContainers = Object.keys(data).map((language, index) => {
	// 			const chartData = data[language]; // Assuming your data structure
	// 			const chartConfig = this.getChartConfiguration(language, chartData);

	// 			return `<div class="chart">
	//               <canvas id="chart${index + 1}"></canvas>
	//               <script>
	//                 ${chartConfig}
	//               </script>
	//             </div>`;
	// 		});

	// 		return `
	//     <!DOCTYPE html>
	//     <html lang="en">
	//     <head>
	//         <meta charset="UTF-8">
	//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
	//         <link rel="stylesheet" href="${styleSrc}">
	//         <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
	//         <script src="${chartScriptSrc}" defer type="module"></script>
	//         <title>Code Timer Stats</title>
	//     </head>
	//     <body>
	//             <nav class="nav__container">
	//                 <img src="${logoSrc}" width="100" />
	//                 <h1>codegroove stats</h1>
	//             </nav>
	//         <main>
	//             <section class="section__container">
	//                 ${chartContainers.join('')}
	//             </section>
	//         </main>
	//     </body>
	//     </html>`;
	// 	}

	// 	getChartConfiguration(language: string, data: any) {
	// 		// Your logic to generate chart configuration based on data
	// 		return `
	//     const data_${language} = ${JSON.stringify(data)};
	//     new Chart(
	//       document.getElementById('chart${index + 1}'),
	//       {
	//         type: 'bar',
	//         data: {
	//           labels: data_${language}.map(row => row.year),
	//           datasets: [
	//             {
	//               label: 'Acquisitions by year',
	//               data: data_${language}.map(row => row.count),
	//             },
	//           ],
	//         },
	//       }
	//     );
	//   `;
	// 	}
}

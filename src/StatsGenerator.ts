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

	async init() {
		const durations = await this.fetchData();
		const chartsHtml = this.generateChartsHtml(durations);
		this.panel.webview.html = chartsHtml;
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
			const durations = sessions.map((session) =>
				this.getDurationPerProjectAndPerLanguage(session),
			);
			return durations;
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
		const durationInChunks: any = { type: 'line' };
		const durationPerProject: any = { type: 'bar' };
		const durationPerLanguage: any = { type: 'doughnut' };
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

			// TODO: make it only filter by day and month if proper list is provided
			if (data[1] !== undefined) {
				const dayKey = new Date(entry.start).getDate();
				console.log('day key', dayKey);
				if (!durationInChunks[dayKey]) {
					durationInChunks[dayKey] = 0;
				}
				durationInChunks[dayKey] += totalSeconds;
			}

			if (data[2] !== undefined) {
				const monthKey = new Date(entry.start).getMonth();
				console.log('months', monthKey);
				if (!durationInChunks[monthKey]) {
					durationInChunks[monthKey] = 0;
				}
				durationInChunks[monthKey] += totalSeconds;
			}
		});

		return [durationInChunks, durationPerProject, durationPerLanguage];
	}

	generateChartsHtml(data: any) {
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

		const chartScriptPath = vscode.Uri.joinPath(
			this.context.extensionUri,
			'src',
			'charts.js',
		);
		const chartScriptSrc = this.panel.webview.asWebviewUri(chartScriptPath);

		const chartContainers = data.flat().map((stat: any, index: any) => {
			return `<div class="chart">
	              <canvas id="chart${index + 1}"></canvas>
	            </div>`;
		});

		return `
	    <!DOCTYPE html>
	    <html lang="en">
	    <head>
	        <meta charset="UTF-8">
	        <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
	        <link rel="stylesheet" href="${styleSrc}">
	        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
            <script src="${chartScriptSrc}" defer></script>
	        <title>Code Timer Stats</title>
	    </head>
	    <body>
	            <nav class="nav__container">
	                <img src="${logoSrc}" width="100" />
	                <h1>codegroove stats</h1>
	            </nav>
	        <main>
	            <section class="section__container" data=${JSON.stringify(
					data.flat(),
				)}>
	                ${chartContainers.join('')}
	            </section>
	        </main>
	    </body>
	    </html>`;
	}
}

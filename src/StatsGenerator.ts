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
	fileOperator;

	constructor(context: vscode.ExtensionContext, fileOperator: any) {
		this.context = context;
		this.fileOperator = fileOperator;
	}

	public async init() {
		const durations = await this.fetchData();
		const chartsHtml = this.generateChartsHtml(durations);
		this.panel.webview.html = chartsHtml;
	}

	private async fetchData() {
		try {
			let stats = await this.fileOperator.readStats();
			stats = stats.filter(
				(stat: Session) =>
					stat.language !== 'No active editor detected',
			);
			const [dailySessions, monthlySessions, yearlySessions] =
				this.filterDates(stats);

			const dailyDurations = this.getDurationPerProjectAndPerLanguage(
				dailySessions,
				'daily',
			);
			const monthlyDurations = this.getDurationPerProjectAndPerLanguage(
				monthlySessions,
				'monthly',
			);
			const yearlyDurations = this.getDurationPerProjectAndPerLanguage(
				yearlySessions,
				'yearly',
			);
			const durations = [
				dailyDurations,
				monthlyDurations,
				yearlyDurations,
			];

			return durations;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	private filterDates(data: Session[]) {
		const dailySessions = data.filter(
			(session) =>
				new Date(session.start).getDate() === new Date().getDate(),
		);

		const monthlySessions = data.filter(
			(session) =>
				new Date(session.start).getMonth() === new Date().getMonth(),
		);
		const yearlySessions = data.filter(
			(session) =>
				new Date(session.start).getFullYear() ===
				new Date().getFullYear(),
		);

		return [dailySessions, monthlySessions, yearlySessions];
	}

	private getDurationPerProjectAndPerLanguage(
		data: Session[],
		chunk: string,
	) {
		const durationInChunks: any = { type: 'line' };
		const durationPerProject: any = { type: 'bar' };
		const durationPerLanguage: any = { type: 'doughnut' };

		data.forEach((session: Session) => {
			const totalSeconds = session.duration.seconds;

			if (!durationPerProject[session.project]) {
				durationPerProject[session.project] = 0;
			}
			durationPerProject[session.project] += totalSeconds / 3600;

			if (!durationPerLanguage[session.language]) {
				durationPerLanguage[session.language] = 0;
			}
			durationPerLanguage[session.language] += totalSeconds / 3600;

			switch (chunk) {
				case 'daily':
					const startHour = new Date(session.start).getHours();
					const endHour =
						new Date(session.start).getHours() +
						Math.ceil(totalSeconds / 3600);

					for (let hour = startHour; hour <= endHour; hour++) {
						if (!durationInChunks[hour]) {
							durationInChunks[hour] = 0;
						}
						durationInChunks[hour] +=
							+totalSeconds / (endHour - startHour + 1) / 3600;
					}

				case 'monthly':
					const dayKey = new Date(session.start).getDate();
					if (!durationInChunks[dayKey]) {
						durationInChunks[dayKey] = 0;
					}
					durationInChunks[dayKey] += totalSeconds / 3600;

				case 'yearly':
					const monthKey = new Date(session.start).getMonth() + 1;
					if (!durationInChunks[monthKey]) {
						durationInChunks[monthKey] = 0;
					}
					durationInChunks[monthKey] += totalSeconds / 3600;
			}
		});

		return [durationInChunks, durationPerProject, durationPerLanguage];
	}

	private getFileSrc(pathDir: string, pathFile: string): vscode.Uri {
		const path = vscode.Uri.joinPath(
			this.context.extensionUri,
			pathDir,
			pathFile,
		);
		const fileSrc = this.panel.webview.asWebviewUri(path);
		return fileSrc;
	}

	private generateChartsHtml(data: any): string {
		const logoSrc = this.getFileSrc('assets', 'codegroove.png');
		const styleSrc = this.getFileSrc('src', 'styles.css');
		const chartScriptSrc = this.getFileSrc('src', 'charts.js');

		const chartContainers = data
			.flat()
			.map((stat: Session, index: number) => {
				let title;
				index <= 2
					? (title = 'daily')
					: index <= 5
					? (title = 'monthly')
					: (title = 'yearly');
				return `
					<div class="chart__container">
						<h2 class="chart__heading">${title}</h2>
						<div class="chart">
	                        <canvas id="chart${index + 1}"></canvas>
	                    </div>
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

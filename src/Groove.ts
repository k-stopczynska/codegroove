import * as vscode from 'vscode';
import * as cp from 'child_process';
const path = require('path');

export class Groove {
	private API_KEY = process.env.YOUTUBE_API_KEY;
	private BASE_URI = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=focus&key=${this.API_KEY}`;

	panel = vscode.window.createWebviewPanel(
		'groove',
		'Play Some Groove',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		},
	);

	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	public async init() {
		await this.startServer();
		const searchResult = await this.utubeFetch();
		const musicHtml = await this.generateYoutubeCharts(searchResult);
		this.panel.webview.html = musicHtml;
		this.openSimpleBrowser();
	}

	private async startServer() {
		const serverPath = path.join(__dirname, '..', 'static/server.js');
		let serverProcess: cp.ChildProcess | undefined;
		if (!serverProcess) {
			serverProcess = cp.fork(String(serverPath));
			console.log('Server started on http://localhost:3000');
		} else {
			serverProcess.kill();
		}
	}

	private async utubeFetch() {
		try {
			const searchResult = [];
			const response = await fetch(this.BASE_URI);
			const data: any = await response.json();
			const videosList = data.items;
			for (const vid of videosList) {
				const channelTitle = vid.snippet.channelTitle;
				const videoTitle = vid.snippet.title;
				const videoUrl = `https://www.youtube.com/embed/${vid.id.videoId}`;
				const thumbnail = vid.snippet.thumbnails.default.url;
				searchResult.push({
					channelTitle,
					videoTitle,
					videoUrl,
					thumbnail,
				});
			}
			console.log(searchResult);
			return searchResult;
		} catch (er: any) {
			console.error(er.message);
		}
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

	private async openSimpleBrowser() {
		const taskDefinition: vscode.TaskDefinition = {
			type: 'shell',
		};

		const taskName = 'simpleBrowser.show';
		const taskSource = 'Custom Tasks';

		const inputId = 'Simple Browser: Show';
		const inputCommand = 'simpleBrowser.show';
		const inputArgs = ['http://localhost:3000'];

		const shellExecution = new vscode.ShellExecution('');
		const task = new vscode.Task(
			taskDefinition,
			vscode.TaskScope.Workspace,
			taskName,
			taskSource,
			shellExecution,
		);

		await vscode.commands.executeCommand(inputCommand, inputArgs[0]);

		await vscode.tasks.executeTask(task);
	}

	private async generateYoutubeCharts(data: any) {
		const logoSrc = this.getFileSrc('assets', 'codegroove.png');
		const styleSrc = this.getFileSrc('static', 'styles.css');
		// const playerScriptSrc = this.getFileSrc('static', 'player.js');

		const musicContainers = await data.map((vid: any, index: number) => {
			const { channelTitle, videoTitle, videoUrl, thumbnail } = vid;
			return `
					<div class="chart__container">
						<h2 class="chart__heading">${videoTitle}</h2>
						<h3>${channelTitle}</h3>
						<div class="thumbnail" style="background-image: url(${thumbnail})">
	                        <iframe id=${index} width="100%" height="100%" src=${videoUrl} frameborder="0" allow="presentation; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
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
	        <title>play some groove</title>
	    </head>
	    <body>
	            <nav class="nav__container">
	                <img src="${logoSrc}" width="100" />
	                <h1>music</h1>
	            </nav>
	        <main>
	            <section class="section__container" 
				)}>
	                 ${musicContainers.join('')}
	            </section>
	        </main>
	    </body>
	    </html>`;
	}
}

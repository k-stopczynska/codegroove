import * as vscode from 'vscode';

export class Groove {
	private API_KEY = process.env.YOUTUBE_API_KEY;
	private BASE_URI = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=focus&key=${this.API_KEY}`;

	panel = vscode.window.createWebviewPanel(
		'groove',
		'Play Some Groove',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
		},
	);
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	public async init() {
		const searchResult = await this.utubeFetch();
		const musicHtml = await this.generateYoutubeCharts(searchResult);
		this.panel.webview.html = musicHtml;
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

	private async generateYoutubeCharts(data: any) {
		const logoSrc = this.getFileSrc('assets', 'codegroove.png');
		const styleSrc = this.getFileSrc('static', 'styles.css');
		// const chartScriptSrc = this.getFileSrc('static', 'charts.js');

		const musicContainers = await data.map((vid: any) => {
			const { channelTitle, videoTitle, videoUrl, thumbnail } = vid;
			return `
					<div class="chart__container">
						<h2 class="chart__heading">${videoTitle}</h2>
						<h3>${channelTitle}</h3>
						<div class="thumbnail" style="backgroundImage: ${thumbnail}">
	                        <iframe width="100%" height="100%" src=${videoUrl} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen sandbox="allow-presentation allow-scripts allow-same-origin"></iframe>
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
	    <body sandbox="allow-presentation allow-scripts allow-same-origin">
	            <nav class="nav__container">
	                <img src="${logoSrc}" width="100" />
	                <h1>music</h1>
	            </nav>
	        <main>
	            <section class="section__container" data=${JSON.stringify(
					data.flat(),
				)}>
	                ${musicContainers.join('')}
	            </section>
	        </main>
	    </body>
	    </html>`;
	}
}

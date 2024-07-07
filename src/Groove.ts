import * as vscode from 'vscode';
import * as cp from 'child_process';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as path from 'path';
import * as chrome from 'selenium-webdriver/chrome';
import { ServiceBuilder } from 'selenium-webdriver/chrome';

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
		this.panel.webview.onDidReceiveMessage(this.handleMessage.bind(this));
	}

	public async init() {
		const searchResult = await this.utubeFetch();
		const musicHtml = await this.generateYoutubeCharts(searchResult);
		this.panel.webview.html = musicHtml;
		// this.openHiddenLink(
		// 	'https://www.youtube.com/embed/AzDnpvjNcdQ?si=tfCphlCYo_ux6KZS',
		// );
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

	private handleMessage(message: any) {
		switch (message.command) {
			case 'openLink':
				this.openHiddenLink(message.videoUrl);
				break;
		}
	}

	private async openHiddenLink(link: string) {
		const chromeOptions = new Options();

		const chromedriverPath = path.resolve(
			__dirname,
			'..',
			'node_modules',
			'chromedriver',
			'lib',
			'chromedriver',
			'chromedriver',
		);

		const chromeService = new chrome.ServiceBuilder(chromedriverPath);

		let driver: WebDriver = new Builder()
			.forBrowser('chrome')
			.setChromeOptions(chromeOptions)
			.setChromeService(chromeService)
			.build();

		try {
			await driver.get(link);
			// TODO: operate on this link to play, stop etc
			// await driver.wait(until.elementLocated(By.id('some-element-id')), 10000);
		} catch (error) {
			console.error('Failed to open link:', error);
		}
	}

	private async generateYoutubeCharts(data: any) {
		const logoSrc = this.getFileSrc('assets', 'codegroove.png');
		const styleSrc = this.getFileSrc('static', 'styles.css');
		const playerScriptSrc = this.getFileSrc('static', 'player.js');

		const musicContainers = await data.map((vid: any, index: number) => {
			const { channelTitle, videoTitle, videoUrl, thumbnail } = vid;
			return `
					<div class="chart__container">
						<h2 class="chart__heading">${videoTitle}</h2>
						<h3>${channelTitle}</h3>
						<div class="thumbnail player"  id=${index} src=${videoUrl} style="background-image: url(${thumbnail}); width: 300px; height: 200px">
	                   
	                    </div>
					</div>`;
		});

		return `
	    <!DOCTYPE html>
	    <html lang="en">
	    <head>
	        <meta charset="UTF-8">
	        <meta name="viewport" content="width=device-width, initial-scale=1.0">
			 <script src="${playerScriptSrc}" defer type="module"></script>
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

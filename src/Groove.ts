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
	private driver: any;

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
		if (this.driver === undefined || this.driver === null) {
			this.driver = this.getWebDriver();
		}

		switch (message.command) {
			case 'openLink':
				this.openHiddenLink(message.videoUrl, this.driver);
				break;
			case 'togglePlay':
				this.togglePlay(this.driver);
				break;
			case 'toggleMute':
				this.toggleMute(this.driver);
		}
	}

	private getWebDriver() {
		const chromeOptions = new Options();
		// chromeOptions.addArguments('--headless');
		// chromeOptions.addArguments('--disable-gpu');
		// chromeOptions.addArguments('--no-sandbox');

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
		return driver;
	}

	private async openHiddenLink(link: string, driver: WebDriver) {
		try {
			await driver.get(link);

			const largePlayButton = await driver.wait(
				until.elementLocated(By.className('ytp-large-play-button')),
				1000,
			);
			largePlayButton.click();
		} catch (error) {
			console.error('Failed to open link:', error);
		}
	}

	private async togglePlay(driver: WebDriver) {
		const playButton = await driver.wait(
			until.elementLocated(By.className('ytp-play-button')),
			1000,
		);
		playButton.click();
	}

	private async toggleMute(driver: WebDriver) {
		const muteButton = await driver.wait(
			until.elementLocated(By.className('ytp-mute-button')),
			1000,
		);
		muteButton.click();
	}

	private async generateYoutubeCharts(data: any) {
		const logoSrc = this.getFileSrc('assets', 'codegroove.png');
		const styleSrc = this.getFileSrc('static', 'styles.css');
		const playerScriptSrc = this.getFileSrc('static', 'player.js');

		const musicContainers = await data.map((vid: any, index: number) => {
			const { channelTitle, videoTitle, videoUrl, thumbnail } = vid;
			return `
					<div class="chart__container">
						<div class="thumbnail player"  id=${index} src=${videoUrl} style="background-image: url(${thumbnail})">
							<div class="ytp-title-container">
								<h2 class="chart__heading video__heading">${videoTitle}</h2>
							</div>
	                   		<button class="ytp-large-play-button ytp-button ytp-large-play-button-red-bg active" aria-label="Odtwórz" title="Odtwórz"><svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg></button>

					   		<div class="ytp-controls-container">
					   			<div class="ytp-chrome-controls">
	       							<button class="ytp-play-button ytp-button" aria-keyshortcuts="k" data-title-no-tooltip="Odtwórz" aria-label="Odtwórz skrót klawiszowy k" title="Odtwórz (k)">
            							<svg class="play-icon hidden" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill="#fff">
                							<path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path>
            							</svg>
            							<svg class="pause-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill="#fff">
                							<path class="ytp-svg-fill" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path>
            							</svg>
        							</button>


        							<button class="ytp-mute-button ytp-button" aria-keyshortcuts="m" data-title-no-tooltip="Wycisz" aria-label="Wycisz skrót klawiszowy m" title="Wycisz (m)">
            							<svg class="unmute-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                							<path class="ytp-svg-fill ytp-svg-volume-animation-speaker" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff"></path>
            							</svg>
            							<svg class="mute-icon hidden" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                							<path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff"></path>
            							</svg>
        							</button>
					   			</div>
					   			<h3 class="channel__heading">${channelTitle}</h3>
	                    	</div>
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

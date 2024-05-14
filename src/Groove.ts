import * as vscode from 'vscode';

export class Groove {
	private BASE_URI = 'https://www.googleapis.com/youtube/v3';

	utubeFetch(uri: any) {
		console.log('fetching data from utube, ' + uri);
	}
}

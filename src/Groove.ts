import * as vscode from 'vscode';

// GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1

// Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json

export class Groove {
	private BASE_URI = 'https://www.googleapis.com/youtube/v3';

	utubeFetch(uri: any) {
		console.log('fetching data from utube, ' + uri);
		return gapi.client.youtube.search
			.list({
				part: ['snippet'],
				maxResults: 25,
				q: 'coding focus',
			})
			.then(
				function (response: any) {
					// Handle the results here (response.result has the parsed body).
					console.log('Response', response);
				},
				function (err: any) {
					console.error('Execute error', err);
				},
			);
	}

	load() {
		return gapi.load('client:auth2', function () {
			gapi.auth2.init({ client_id: 'YOUR_CLIENT_ID' });
		});
	}

	authenticate() {
		return gapi.auth2
			.getAuthInstance()
			.signIn({
				scope: 'https://www.googleapis.com/auth/youtube.readonly',
			})
			.then(
				function () {
					console.log('Sign-in successful');
				},
				function (err: any) {
					console.error('Error signing in', err);
				},
			);
	}

	loadClient() {
		return gapi.client
			.load(
				'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
			)
			.then(
				function () {
					console.log('GAPI client loaded for API');
				},
				function (err: any) {
					console.error('Error loading GAPI client for API', err);
				},
			);
	}
}

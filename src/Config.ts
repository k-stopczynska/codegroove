import * as vscode from 'vscode';

export class Config {
	inactivityDropdown: any;

	constructor() {
		this.inactivityDropdown = vscode.window.showQuickPick(
			['5mins', '15mins', '30mins', '45mins', '1hour'],
			{ placeHolder: 'Pick inactivity treshold' },
		);
		this.onChange();
	}

	onChange() {
		this.inactivityDropdown.then((treshold: string) => {
			let currentTreshold = 15;
			switch (treshold) {
				case '5mins':
					currentTreshold = 5;
					break;
				case '30mins':
					currentTreshold = 30;
					break;
				case '45mins':
					currentTreshold = 45;
					break;
				case '1hour':
					currentTreshold = 60;
					break;
				default:
					break;
			}
			console.log('treshold', treshold);
			console.log('currentTreshold', currentTreshold);
		});
	}
}

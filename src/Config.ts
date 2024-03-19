import * as vscode from 'vscode';

export class Config {
	private inactivityDropdown: Thenable<string | undefined>;

	constructor() {
		this.inactivityDropdown = vscode.window.showQuickPick(
			['5mins', '15mins', '30mins', '45mins', '1hour'],
			{ placeHolder: 'Pick inactivity threshold' },
		);
		this.onChange();
	}

	private onChange() {
		this.inactivityDropdown.then((threshold: string | undefined) => {
			let currentThreshold = 15;
			switch (threshold) {
				case '5mins':
					currentThreshold = 5;
					break;
				case '30mins':
					currentThreshold = 30;
					break;
				case '45mins':
					currentThreshold = 45;
					break;
				case '1hour':
					currentThreshold = 60;
					break;
				default:
					break;
			}
			vscode.workspace
				.getConfiguration('codegroove')
				.update('inactivityThreshold', currentThreshold, true);
		});
	}
}

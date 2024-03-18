import * as vscode from 'vscode';

export class Config {
	inactivityDropdown: any;

	constructor() {
		this.inactivityDropdown = vscode.window.showQuickPick(
			['5mins', '15mins', '30mins', '45mins', '1hour'],
			{ placeHolder: 'Pick inactivity treshold' },
		);
	}
}

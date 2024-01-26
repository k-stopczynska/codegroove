import * as vscode from 'vscode';

export class CodeTimer {
	// TODO: initialize timer on vscode run
	init() {
		this.statusBar.show();
		this.statusBar.text = 'CodeGroove in session';
	}
	// TODO: create status bar
	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);
	// TODO: get current session (project, language, id)
	// TODO: get current session time
	// TODO: update daily and total coding time
	// TODO: display current session time in status bar
	// TODO: create UI for status bar | decide what should be displayed (total for today and for project we are currently working on?)
	// TODO: react on active window change
	// TODO: react on no activity
	// TODO: react on keystrokes
	// TODO: react on switching project
	// TODO: add listeners to events above
	// TODO: dispose status bar and timer
	dispose() {
		this.statusBar.dispose();
	}
}

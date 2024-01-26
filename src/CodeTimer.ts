import * as vscode from 'vscode';
import { v4 } from 'uuid';

export class CodeTimer {

	init() {
		const timer = setInterval(() => this.updateStatusBar(), 1000);
    }
    
	start = this.getCurrentSessionTime();

	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);

	getCurrentSession() {
		const project = this.getCurrentProject();
		const language = this.getCurrentLanguage();
		const id = this.getSessionId();
		return { project, language, id };
	}

	getCurrentProject() {
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			const project = folders[0].name;
			return project;
		} else {
			return 'No workspace folder opened';
		}
	}

	getCurrentLanguage() {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const language = editor.document.languageId;
			return language;
		} else {
			return 'No active editor detected';
		}
	}

	getSessionId() {
		const sessionId = v4();
		return sessionId;
	}

	getCurrentSessionTime() {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const startTime = date.toLocaleString('en-US', { timeZone: timeZone });
		return startTime;
	}

	getSessionDuration() {
		const startTime = new Date(this.start).getTime();
		const currentTime = new Date().getTime();
		const diff = currentTime - startTime;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return { hours, minutes, seconds };
	}

	updateStatusBar() {
		const timeElapsed = this.getSessionDuration();
		this.statusBar.text = `CodeGroove elapsed: ${timeElapsed.hours}: ${
			timeElapsed.minutes % 60
		}: ${timeElapsed.seconds % 60}`;
		this.statusBar.show();
	}
	// TODO: create UI for status bar | decide what should be displayed (total for today and for project we are currently working on?)
	// TODO: react on active window change
	// TODO: react on no activity
	// TODO: react on keystrokes
	// TODO: react on switching project
	// TODO: add listeners to events above
	// TODO: update daily and total coding time
	// TODO: dispose status bar and timer
	dispose() {
		this.statusBar.dispose();
	}
}

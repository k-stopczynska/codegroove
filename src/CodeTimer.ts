import * as vscode from 'vscode';
import { v4 } from 'uuid';

export class CodeTimer {
	start = this.getCurrentSessionTime();

	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);

	init() {
		const timer = setInterval(() => this.updateStatusBar(), 1000);
		this.onProjectChange = this.onProjectChange.bind(this);
		this.addEventListeners();
	}

	getCurrentSession() {
		const project = this.getCurrentProject();
		const language = this.getCurrentLanguage();
		const id = this.getSessionId();
		return { project, language, id };
	}

	getCurrentProject = () => {
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			const project = folders[0].name;
			return project;
		} else {
			return 'No workspace folder opened';
		}
	};

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

	onProjectChange(event: any) {
		console.log('Root folder changed:', event);
		if (event.focused && event.active) {
			console.log(this.getCurrentProject());
		}
	}

	addEventListeners() {
		// vscode.window.onDidChangeActiveTextEditor(this.onChange);
		vscode.window.onDidChangeWindowState(this.onProjectChange);

		// listener for root folder e.g. project change
		// vscode.workspace.onDidChangeWorkspaceFolders(this.onProjectChange);
	}
	// TODO: update daily and total coding time
	// TODO: create UI with charts as a dashboard

	dispose() {
		this.statusBar.dispose();
	}
}

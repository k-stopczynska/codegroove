import * as vscode from 'vscode';
import { v4 } from 'uuid';

export class CodeTimer {
	start = '';

	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);

	project = '';

	lang = '';

	init() {
		const timer = setInterval(() => this.updateStatusBar(), 1000);
		this.setCurrentLanguage(this.getCurrentLanguage());
		this.setCurrentProject(this.getCurrentProject());
		this.setCurrentSession();
		this.onProjectChange = this.onProjectChange.bind(this);
		this.onLangChange = this.onLangChange.bind(this);
		this.addEventListeners();
	}

	setCurrentSession() {
		const project = this.project;
		const language = this.lang;
		const id = this.getSessionId();
		this.setStart(this.getCurrentSessionTime());
		const duration = this.getSessionDuration();
		console.log(project, language, this.start, duration);
		return { project, language, id };
	}

	setStart(start: string) {
		this.start = start;
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

	setCurrentProject(project: string) {
		this.project = project;
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

	setCurrentLanguage(language: string) {
		this.lang = language;
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
		if (event.focused && event.active) {
			const currProj = this.getCurrentProject();
			if (currProj !== this.project) {
				this.setCurrentProject(currProj);
				this.setCurrentSession();
			}
		}
	}

	onLangChange() {
		const currLang = this.getCurrentLanguage();
		if (
			currLang !== 'No active editor detected' &&
			currLang !== this.lang
		) {
			this.setCurrentLanguage(currLang);
			this.setCurrentSession();
		}
	}

	addEventListeners() {
		vscode.window.onDidChangeActiveTextEditor(this.onLangChange);
		vscode.window.onDidChangeWindowState(this.onProjectChange);
	}
	// TODO: update daily and total coding time
	// TODO: create UI with charts as a dashboard

	dispose() {
		this.statusBar.dispose();
	}
}

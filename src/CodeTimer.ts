import * as vscode from 'vscode';
import { v4 } from 'uuid';

export class CodeTimer {
	// TODO: initialize timer on vscode run
	init() {
        this.statusBar.show();
        const start = this.getCurrentSessionTime()
		this.statusBar.text = `CodeGroove time: ${start}`;
	}
	// TODO: create status bar
	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);
	// TODO: get current session (project, language, id)
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

    // TODO: get current session time
    getCurrentSessionTime() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date();
        const startTime = date.toLocaleString('en-US', {timeZone: timeZone});
        return startTime
    }

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

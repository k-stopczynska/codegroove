import * as vscode from 'vscode';
import { v4 } from 'uuid';
import { Session, Duration } from './types';

export class CodeTimer {
	start = '';

	statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);

	project = '';

	lang = '';

	id = '';

	duration: Duration = { hours: 0, minutes: 0, seconds: 0 };

	sessions: Session[] = [];

	fileOperator: any;

	private inactivityThreshold = 60 * 1000;
	private inactivityTimer: NodeJS.Timeout | null = null;

	async init(fileOperator: any) {
		const timer = setInterval(() => this.updateStatusBar(), 1000);
		this.fileOperator = fileOperator;
		const stats = await this.fileOperator.readStats();
		if (stats[0].project !== '') {
			this.sessions.push(...stats);
		}
		this.setCurrentLanguage(this.getCurrentLanguage());
		this.setCurrentProject(this.getCurrentProject());
		this.setCurrentSession();
		this.startInactivityTimer();
		// this.onProjectChange = this.onProjectChange.bind(this);
		// this.onLangChange = this.onLangChange.bind(this);
		this.addEventListeners();
	}

	private startInactivityTimer() {
		console.log('starting inactivity timer');
		this.inactivityTimer = setInterval(() => {
			console.log(this.inactivityThreshold);
			this.savePreviousSession();
			this.fileOperator.saveStats(this.sessions);
		}, this.inactivityThreshold);
	}

	private resetInactivityTimer() {
		console.log(this.inactivityTimer);
		if (this.inactivityTimer) {
			clearInterval(this.inactivityTimer);
			this.startInactivityTimer();
		}
	}

	setSessionId(sessionId: string) {
		this.id = sessionId;
	}

	setDuration(duration: Duration) {
		this.duration = duration;
	}

	setCurrentSession() {
		const project = this.project;
		const language = this.lang;
		this.setSessionId(this.getSessionId());
		this.setStart(this.getCurrentSessionTime());
		return { project, language };
	}

	savePreviousSession() {
		this.setDuration(this.getSessionDuration());
		const prevSession = {
			project: this.project,
			language: this.lang,
			id: this.id,
			start: this.start,
			duration: this.duration,
		};
		this.sessions.push(prevSession);
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

	async onProjectChange(event: any, isDispose: boolean = false) {
		if ((event.focused && event.active) || isDispose) {
			const currProj = this.getCurrentProject();
			if (currProj !== this.project || isDispose) {
				this.savePreviousSession();
				await this.fileOperator.saveStats(this.sessions);
				this.setCurrentProject(currProj);
				this.setCurrentSession();
			}
		}
	}

	async onLangChange() {
		const currLang = this.getCurrentLanguage();
		if (
			currLang !== 'No active editor detected' &&
			currLang !== this.lang
		) {
			this.savePreviousSession();
			await this.fileOperator.saveStats(this.sessions);
			this.setCurrentLanguage(currLang);
			this.setCurrentSession();
		}
	}

	private handleUserActivity() {
		this.resetInactivityTimer();
	}

	addEventListeners() {
		vscode.window.onDidChangeActiveTextEditor(this.onLangChange, this);
		vscode.window.onDidChangeWindowState((event) => {
			this.onProjectChange(event), this;
			this.resetInactivityTimer();
		});
		vscode.workspace.onDidChangeTextDocument(this.handleUserActivity, this);
		vscode.window.onDidChangeTextEditorSelection(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorVisibleRanges(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorViewColumn(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorOptions(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeActiveTextEditor(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorVisibleRanges(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorSelection(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorVisibleRanges(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorViewColumn(
			this.handleUserActivity,
			this,
		);
		vscode.window.onDidChangeTextEditorOptions(
			this.handleUserActivity,
			this,
		);
	}

	async dispose() {
		try {
			await Promise.all([
				this.onProjectChange({}, true),
				this.statusBar.dispose(),
			]);
		} catch (error) {
			console.error('Error during disposal:', error);
		}
	}
}

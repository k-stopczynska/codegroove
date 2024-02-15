import * as vscode from 'vscode';
import { v4 } from 'uuid';
import { Session, Duration } from './types';

export class CodeTimer {
	private start = '';
	private statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);
	private project = '';
	private lang = '';
	private id = '';
	private duration: Duration = { hours: 0, minutes: 0, seconds: 0 };
	private sessions: Session[] = [];
	protected fileOperator: any;

	// TODO: change this to 15 minutes instead of 1 min after tests
	private inactivityThreshold = 60 * 1000;
	private inactivityTimer: NodeJS.Timeout | null = null;

	protected async init(fileOperator: any) {
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
		this.handleUserActivity = this.handleUserActivity.bind(this);
		this.addEventListeners();
	}

	private startInactivityTimer() {
		this.inactivityTimer = setInterval(() => {
			this.savePreviousSession();
			this.fileOperator.saveStats(this.sessions);
			// TODO: how should it behave when there was no activity for certain period of time? how make it wait for another activity event? which event should start new sess?
			this.setCurrentSession();
		}, this.inactivityThreshold);
	}

	private resetInactivityTimer() {
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
				this.handleUserActivity();
				this.setCurrentSession();
			}
		}
	}

	async onLangChange() {
		const currLang = this.getCurrentLanguage();

	//TODO: make it retry to get language when 'no active editor detected' is returned

		if (
			currLang !== 'No active editor detected' &&
			currLang !== this.lang
		) {
			this.savePreviousSession();
			await this.fileOperator.saveStats(this.sessions);
			this.setCurrentLanguage(currLang);
			this.handleUserActivity();
			this.setCurrentSession();
		}
	}

	private handleUserActivity() {
		this.resetInactivityTimer();
	}

	addEventListeners() {
		vscode.window.onDidChangeActiveTextEditor(this.onLangChange, this);
		vscode.window.onDidChangeWindowState(this.onProjectChange, this);
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

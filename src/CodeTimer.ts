import * as vscode from 'vscode';
import { v4 } from 'uuid';
import { Session, Duration, FileOperatorInstance } from './types';

interface MyWindowStateEvent {
	focused?: boolean;
	active?: boolean;
	state?: vscode.WindowState;
}

export class CodeTimer {
	private start = '';
	private timer: NodeJS.Timeout | undefined = undefined;
	private statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
	);
	private project = '';
	private lang = '';
	private id = '';
	private duration: Duration = { hours: 0, minutes: 0, seconds: 0 };
	private sessions: Session[] = [];
	private isSessionActive: boolean = true;
	public fileOperator: FileOperatorInstance;
	private inactivityThreshold =
		(vscode.workspace
			.getConfiguration('codegroove')
			.get('inactivityThreshold') as number) *
		60 *
		1000;
	private inactivityTimer: NodeJS.Timeout | null = null;

	constructor(fileOperator: FileOperatorInstance) {
		this.fileOperator = fileOperator;
	}

	/**
	 * initializer for the class instance: starts the status bar timer and refreshes it, starts inactivity timer,
	 * adds listeners, and starts current session, if editor is not active retries to get
	 * current used  language
	 * @param fileOperator FileOperator class instance to read and save files
	 */

	public async init(fileOperator: FileOperatorInstance) {
		this.timer = setInterval(() => this.updateStatusBar(), 1000);
		this.fileOperator = fileOperator;
		this.setCurrentSession();
		this.startInactivityTimer();
		this.addEventListeners();
		if (this.lang === 'No active editor detected') {
			setTimeout(
				() => this.setCurrentLanguage(this.getCurrentLanguage()),
				5000,
			);
		}
	}

	/**
	 * creates status bar text and renders it
	 */

	private updateStatusBar() {
		if (this.isSessionActive) {
			const timeElapsed = this.getSessionDuration();
			this.statusBar.text = `codegroove session elapsed: ${
				timeElapsed.hours
			}: ${timeElapsed.minutes % 60}: ${timeElapsed.seconds % 60}`;
			this.statusBar.show();
		}
	}

	/**
	 * creates timestamp for the beginnig of the session
	 * @returns local start time in en-US format
	 */

	private getCurrentSessionTime() {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const startTime = date.toLocaleString('en-US', {
			timeZone: timeZone,
			hour12: false,
		});
		return startTime;
	}

	/**
	 * sets the current session start time
	 * @param start provided start time for the session
	 */

	private setStart(start: string) {
		this.start = start;
	}

	/**
	 * creates session id using uuid library
	 * @returns unique session id
	 */

	private getSessionId() {
		const sessionId = v4();
		return sessionId;
	}

	/**
	 * sets the current session id
	 * @param sessionId provided id for the session
	 */

	private setSessionId(sessionId: string) {
		this.id = sessionId;
	}

	/**
	 * gets current project name from vs code workspace folders
	 * @returns project name if opened or 'No workspace folder opened' if not
	 */

	private getCurrentProject() {
		const folders = vscode.workspace.workspaceFolders;
		if (folders) {
			const project = folders[0].name;
			return project;
		} else {
			return 'No workspace folder opened';
		}
	}

	/**
	 * sets the current session project
	 * @param project provided project name for the session
	 */

	private setCurrentProject(project: string) {
		this.project = project;
	}

	/**
	 * gets current language from vs code window
	 * @returns currently used language if there is opened editor or 'No active editor detected' if not
	 */

	private getCurrentLanguage() {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const language = editor.document.languageId;
			return language;
		} else {
			return 'No active editor detected';
		}
	}

	/**
	 * sets the current session language
	 * @param language provided language of the session
	 */

	private setCurrentLanguage(language: string) {
		this.lang = language;
	}

	/**
	 * sets current session project, language, id and start time
	 */

	private setCurrentSession() {
		this.setStart(this.getCurrentSessionTime());
		this.setSessionId(this.getSessionId());
		this.setCurrentProject(this.getCurrentProject());
		this.setCurrentLanguage(this.getCurrentLanguage());
	}

	/**
	 * calculates the difference between current and start time of the session
	 * @returns object with hours, minutes and seconds of session time
	 */

	private getSessionDuration() {
		const startTime = new Date(this.start).getTime();
		const currentTime = new Date().getTime();
		const diff = currentTime - startTime;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return { hours, minutes, seconds };
	}

	/**
	 * sets the current session duration
	 * @param duration provided duration object of the session
	 */

	private setDuration(duration: Duration) {
		this.duration = duration;
	}

	/**
	 * saves previous session object into sessions array
	 */

	private savePreviousSession() {
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

	/**
	 * closes and saves previous session if was active and starts new one on project change event
	 * @param event window state vs code window event
	 * @param isDispose window dispose event
	 */

	private async onProjectChange(
		event: MyWindowStateEvent,
		isDispose: boolean = false,
	) {
		if ((event.focused && event.active) || isDispose) {
			const currProj = this.getCurrentProject();
			if (currProj !== this.project || isDispose) {
				if (this.isSessionActive) {
					this.savePreviousSession();
					await this.fileOperator.saveStats(this.sessions);
				}
				this.setCurrentProject(currProj);
				this.handleUserActivity();
				this.setCurrentSession();
			}
		}
	}

	/**
	 * closes and saves previous session if was active and starts new one on language change event
	 */

	private async onLangChange() {
		const currLang = this.getCurrentLanguage();
		if (
			(currLang !== this.lang && this.isSessionActive) ||
			(this.lang === 'No active editor detected' && this.isSessionActive)
		) {
			this.savePreviousSession();
			this.setCurrentLanguage(currLang);
			this.handleUserActivity();
			this.setCurrentSession();
		}
	}

	/**
	 * updates local state of inactivityThreshold based on config workspace
	 */

	private setInactivityThreshold() {
		this.inactivityThreshold =
			(vscode.workspace
				.getConfiguration('codegroove')
				.get('inactivityThreshold') as number) *
			60 *
			1000;
	}

	/**
	 * when inactivityThreshold time is up saves the session and changes the state of session to inactive
	 */

	private startInactivityTimer() {
		this.inactivityTimer = setTimeout(() => {
			this.savePreviousSession();
			this.fileOperator.saveStats(this.sessions);
			this.isSessionActive = false;
		}, this.inactivityThreshold);
	}

	/**
	 * resets inactivity timer, clears up side-effects, and starts new active session after inactivity
	 */

	private resetInactivityTimer() {
		if (this.inactivityTimer) {
			clearTimeout(this.inactivityTimer);
			this.startInactivityTimer();
			if (!this.isSessionActive) {
				this.isSessionActive = true;
				this.setCurrentSession();
			}
		}
	}

	/**
	 * resets inactivity timer on registered events
	 */

	private handleUserActivity() {
		this.resetInactivityTimer();
	}

	/**
	 * adds listeners to detect project and language change and track inactivity time
	 */

	private addEventListeners() {
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
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('codegroove'))
				this.setInactivityThreshold();
			this.resetInactivityTimer();
		});
	}

	/**
	 * awaits for all the data to be stored, and dispose status bar before disposing window, clears up side-effects
	 */

	public async dispose() {
		try {
			await Promise.all([
				this.onProjectChange({}, true),
				this.statusBar.dispose(),
			]);
			clearInterval(this.timer);
		} catch (error) {
			console.error('Error during disposal:', error);
		}
	}
}

import * as vscode from 'vscode';

export interface Duration {
	hours: number;
	minutes: number;
	seconds: number;
}

export interface Session {
	project: string;
	language: string;
	id: string;
	start: string;
	duration: string | Duration;
}

export interface FileOperatorInstance {
	context: vscode.ExtensionContext;
	readStats(): Promise<Session[] | unknown>;
	saveStats(updatedData: Session[]): Promise<void>;
}

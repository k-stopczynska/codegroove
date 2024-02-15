import * as vscode from 'vscode';
import * as fs from 'fs';
import { Session } from './types';

export class FileOperator {
	private context;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	private getExtensionStoragePath() {
		return this.context.globalStorageUri;
	}

	private async isFileExists(fileUri: vscode.Uri): Promise<boolean> {
		try {
			await vscode.workspace.fs.stat(fileUri);
			return true;
		} catch (error) {
			return false;
		}
	}

	async readStats() {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.json',
		);

		try {
			const fileExists = await this.isFileExists(jsonFilePath);

			if (fileExists) {
				const content = await vscode.workspace.fs.readFile(
					jsonFilePath,
				);
				const jsonData = JSON.parse(content.toString());
				console.log('Read JSON data:', jsonData);
				return jsonData;
			} else {
				console.log('File not found. Creating a new one.');
				const newData: Session[] = [];
				await this.saveStats(newData);
			}
		} catch (error) {
			console.error('Error reading JSON file:', error);
		}
	}

	async saveStats(updatedData: Session[]) {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.json',
		);
		const content = JSON.stringify(updatedData);
		try {
			await fs.promises.appendFile(jsonFilePath.fsPath, content);
		} catch (error) {
			console.error('Error updating JSON file', error);
		}
	}
}

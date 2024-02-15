import * as vscode from 'vscode';
import * as fs from 'fs';
import { Session } from './types';

export class FileOperator {
	context;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	private getExtensionStoragePath() {
		return this.context.globalStorageUri;
	}

	private getJsonFilePath() {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.json',
		);
		return jsonFilePath;
	}

	private async isFileExists(fileUri: vscode.Uri): Promise<boolean> {
		try {
			await vscode.workspace.fs.stat(fileUri);
			return true;
		} catch (error) {
			return false;
		}
	}

	public async readStats() {
		const jsonFilePath = this.getJsonFilePath();
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
				const newData: Session[] = [];
				await this.saveStats(newData);
			}
		} catch (error) {
			console.error('Error reading JSON file:', error);
		}
	}

	public async saveStats(updatedData: Session[]) {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.json',
		);
		const content = JSON.stringify(updatedData);
		try {
			await vscode.workspace.fs.writeFile(
				jsonFilePath,
				Buffer.from(content),
			);
			console.log('JSON file updated successfully', content);
		} catch (error) {
			await fs.promises.writeFile(jsonFilePath.fsPath, content);
			console.error('Error updating JSON file', error);
		}
	}
}

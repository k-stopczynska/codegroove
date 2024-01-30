import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

import { Session } from './types';

export class FileOperator {
	context;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	getExtensionStoragePath() {
		return this.context.globalStorageUri;
	}

	private async isFileExists(fileUri: vscode.Uri): Promise<boolean> {
		try {
			await vscode.workspace.fs.stat(fileUri);
			return true;
		} catch (error) {
			// If an error occurs, it means the file doesn't exist
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

		try {
			const content = JSON.stringify(updatedData, null, 2);
			await vscode.workspace.fs.writeFile(
				jsonFilePath,
				Buffer.from(content),
			);
			console.log('JSON file updated successfully');
		} catch (error) {
			console.error('Error updating JSON file:', error);
		}
	}
}

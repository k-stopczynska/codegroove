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
		if (this.context) {
			return (
				this.context.globalStorageUri ||
				path.join(this.context.globalStorageUri, 'stats.json')
			);
		}
	}

	async readStats() {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = path.join(extensionStoragePath, 'stats.json');

		try {
			const content = await vscode.workspace.fs.readFile(
				vscode.Uri.file(jsonFilePath),
			);
			const jsonData = JSON.parse(content.toString());
			console.log('Read JSON data:', jsonData);
		} catch (error) {
			console.error('Error reading JSON file:', error);
		}
	}

	async saveStats(updatedData: Session) {
		const extensionStoragePath = this.getExtensionStoragePath();
		const jsonFilePath = path.join(extensionStoragePath, 'stats.json');

		try {
			const content = JSON.stringify(updatedData, null, 2);
			await vscode.workspace.fs.writeFile(
				vscode.Uri.file(jsonFilePath),
				Buffer.from(content),
			);
			console.log('JSON file updated successfully');
		} catch (error) {
			console.error('Error updating JSON file:', error);
		}
    }
}

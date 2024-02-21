import * as vscode from 'vscode';
import * as fs from 'fs';
import { Session } from './types';

export class FileOperator {
	private columns = ['id', 'project', 'language', 'start', 'duration'];
	public context;

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
				// console.log('Read JSON data:', jsonData);
				return jsonData;
			} else {
				const newData: Session[] = [];
				await this.saveStats(newData);
			}
		} catch (error) {
			console.error('Error reading JSON file:', error);
		}
	}

	// public async saveStats(updatedData: Session[]) {
	// 	const jsonFilePath = this.getJsonFilePath();
	// 	const content = JSON.stringify(updatedData);
	// 	try {
	// 		await vscode.workspace.fs.writeFile(
	// 			jsonFilePath,
	// 			Buffer.from(content),
	// 		);
	// 		// console.log('JSON file updated successfully', content);
	// 	} catch (error) {
	// 		await fs.promises.writeFile(jsonFilePath.fsPath, content);
	// 		console.error('Error updating JSON file', error);
	// 	}
	// }

	public async saveStats(updatedData: Session[]) {
		// get file path for csv
		const extensionStoragePath = this.getExtensionStoragePath();
		const csvFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.csv',
		);

		const content = this.prepareCsvString(updatedData);

		try {
			await fs.promises.appendFile(csvFilePath.fsPath, content);
		} catch (error) {
			console.error('Error updating csv file:', error);
		}
	}

	private nullToEmptyReplacer(_key: string, value: any) {
		return null === value ? '' : value;
	}

	private prepareDataItem(dataItem: Record<string, any>) {
		return this.columns.map((column) => {
			let value = dataItem[column] ?? '-';
			return JSON.stringify(value, this.nullToEmptyReplacer);
		});
	}

	private prepareCsvString(data: Record<string, any>[]) {
		const headingsRow = this.columns.join(',');
		const contentRows = data.map((dataItem) => {
			return this.prepareDataItem(dataItem).join(',');
		});
		const csvDataString = [headingsRow, ...contentRows].join('\r\n');
		return csvDataString;
	}
}

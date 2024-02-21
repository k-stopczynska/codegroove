import * as vscode from 'vscode';
import * as fs from 'fs';
const csvParser = require('csv-parser');
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

	private getCsvFilePath() {
		const extensionStoragePath = this.getExtensionStoragePath();
		const csvFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.csv',
		);
		return csvFilePath;
	}

	private async isFileExists(fileUri: vscode.Uri): Promise<boolean> {
		try {
			await vscode.workspace.fs.stat(fileUri);
			return true;
		} catch (error) {
			return false;
		}
	}

	// public async readStats() {
	// 	const jsonFilePath = this.getJsonFilePath();
	// 	try {
	// 		const fileExists = await this.isFileExists(jsonFilePath);

	// 		if (fileExists) {
	// 			const content = await vscode.workspace.fs.readFile(
	// 				jsonFilePath,
	// 			);
	// 			const jsonData = JSON.parse(content.toString());
	// 			// console.log('Read JSON data:', jsonData);
	// 			return jsonData;
	// 		} else {
	// 			const newData: Session[] = [];
	// 			await this.saveStats(newData);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error reading JSON file:', error);
	// 	}
	// }

	public async readStats() {
		const csvData: Session[] = [];

		const csvFilePath = this.getCsvFilePath();

		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(csvFilePath.fsPath, 'utf-8');

			stream
				.pipe(csvParser())
				.on('data', (row: any) => {
					csvData.push(row);
				})
				.on('end', () => {
					resolve(csvData);
					console.log(csvData);
				})
				.on('error', (error: any) => {
					reject(error);
				});
		});
	}

	public async saveStats(updatedData: Session[]) {
		const csvFilePath = this.getCsvFilePath();
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

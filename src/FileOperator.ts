import * as vscode from 'vscode';
import * as fs from 'fs';
import os from 'os';
const csvParser = require('csv-parser');
import { Session } from './types';

export class FileOperator {
	private columns = ['id', 'project', 'language', 'start', 'duration'];
	public context;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.readStats();
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

	private async createStatsFileWithHeadings() {
		const csvFilePath = this.getCsvFilePath();
		const fileExists = await this.isFileExists(csvFilePath);

		if (fileExists) {
			return;
		} else {
			const headingsRow = this.columns.join(',');
			const content = headingsRow + os.EOL;

			try {
				await fs.promises.writeFile(
					csvFilePath.fsPath,
					content,
					'utf-8',
				);
			} catch (error) {
				console.error('Error creating csv file:', error);
			}
		}
	}

	public async readStats() {
		const csvData: Session[] = [];
		const csvFilePath = this.getCsvFilePath();
		await this.createStatsFileWithHeadings();

		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(csvFilePath.fsPath, 'utf-8');

			stream
				.pipe(csvParser())
				.on('data', (row: any) => {
					csvData.push(row);
				})
				.on('end', () => {
					resolve(csvData);
				})
				.on('error', (error: any) => {
					reject(error);
				});
		});
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
		const contentRows = data.map((dataItem) => {
			return this.prepareDataItem(dataItem).join(',');
		});
		const csvDataString = [...contentRows].join(os.EOL);
		return csvDataString;
	}

	public async saveStats(updatedData: Session[]) {
		const csvFilePath = this.getCsvFilePath();
		const content = this.prepareCsvString(updatedData) + os.EOL;

		try {
			await fs.promises.appendFile(csvFilePath.fsPath, content);
		} catch (error) {
			console.error('Error updating csv file:', error);
		}
	}
}

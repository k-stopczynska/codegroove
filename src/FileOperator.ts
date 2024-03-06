import * as vscode from 'vscode';
import * as fs from 'fs';
import os from 'os';
const csvParser = require('csv-parser');
import { Session, FileOperatorInstance } from './types';

export class FileOperator implements FileOperatorInstance {
	private columns = ['id', 'project', 'language', 'start', 'duration'];
	public context;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.readStats();
	}

	/**
	 * uses vscode context to find the global storage location
	 * @returns global storage Uri
	 */

	private getExtensionStoragePath() {
		return this.context.globalStorageUri;
	}

	/**
	 * joins global storage path with stats.csv file path
	 * @returns stats.csv file path
	 */

	private getCsvFilePath() {
		const extensionStoragePath = this.getExtensionStoragePath();
		const csvFilePath = vscode.Uri.joinPath(
			extensionStoragePath,
			'stats.csv',
		);
		return csvFilePath;
	}

	/**
	 * interacts with workspace local files and based on metadata found recognizes if file exists
	 * @param fileUri file path to searched file
	 * @returns promise resolved to true if file exists in provided Uri, else false
	 */

	private async isFileExists(fileUri: vscode.Uri): Promise<boolean> {
		try {
			await vscode.workspace.fs.stat(fileUri);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * creates stats.csv file with provided headings if file hasn't already been created
	 * @returns early if file already exists
	 */

	private async createStatsFileWithHeadings() {
		const csvFilePath = this.getCsvFilePath();
		const fileExists = await this.isFileExists(csvFilePath);

		if (fileExists) {
			return;
		} else {
			const directoryUri = vscode.Uri.joinPath(csvFilePath, '..');
			try {
				await vscode.workspace.fs.createDirectory(directoryUri);
			} catch (error) {
				console.error('Error creating directory:', error);
				return;
			}

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

	/**
	 * creates readable stream from csv file and parses data into array of objects
	 * @returns promise resolved to an array of objects or rejection if error occurs
	 */

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

	/**
	 * replaces null values with empty strings
	 * @param _key key of the parsed object
	 * @param value value of the parsed object
	 * @returns value if it's not null, otherwise empty string
	 */

	private nullToEmptyReplacer(_key: string, value: any) {
		return null === value ? '' : value;
	}

	/**
	 * maps dataItem values with appropriate headings, converting them into strings
	 * @param dataItem session data item to be mapped
	 * @returns JSON string value if it's not null, otherwise empty string
	 */

	private prepareDataItem(dataItem: Record<string, Session>) {
		return this.columns.map((column) => {
			let value = dataItem[column] ?? '-';
			return JSON.stringify(value, this.nullToEmptyReplacer);
		});
	}

	/**
	 * creates comma separated values separated by new lines
	 * @param data array of objects containing session data
	 * @returns strings of data with operating system end of line characters at the end
	 */

	private prepareCsvString(data: Record<string, any>[]) {
		const contentRows = data.map((dataItem) => {
			return this.prepareDataItem(dataItem).join(',');
		});
		const csvDataString = [...contentRows].join(os.EOL);
		return csvDataString;
	}

	/**
	 * appends csv data string to existing file with operating system end of line characters at the end
	 * @param newData sessions array to save to file
	 */

	public async saveStats(newData: Session[]) {
		const csvFilePath = this.getCsvFilePath();
		const content = this.prepareCsvString(newData) + os.EOL;

		try {
			await fs.promises.appendFile(csvFilePath.fsPath, content);
		} catch (error) {
			console.error('Error updating csv file:', error);
		}
	}
}

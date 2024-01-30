import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

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
    
    
}

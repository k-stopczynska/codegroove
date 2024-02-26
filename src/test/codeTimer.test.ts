import * as assert from 'assert';
import * as mocha from 'mocha';
import * as vscode from 'vscode';
import { mock, when } from 'ts-mockito';
import { expect } from 'chai';
import { CodeTimer } from '../CodeTimer';
import { FileOperator } from '../FileOperator';

function createMockExtensionContext(): vscode.ExtensionContext {
	return mock<vscode.ExtensionContext>();
}

function createMockStatusBar(): vscode.StatusBarItem {
	const statusBarMock: vscode.StatusBarItem = mock<vscode.StatusBarItem>();

	when(statusBarMock.show()).thenReturn(undefined);

	return statusBarMock;
}

suite('CodeTimer Test Suite', () => {
	let codeTimer: any;
	let fileOperatorMock: any;

	const extensionContextMock = createMockExtensionContext();
	const fileOperator = new FileOperator(extensionContextMock);
	fileOperatorMock = fileOperator;
	codeTimer = new CodeTimer(fileOperatorMock);
	const statusBarMock = createMockStatusBar();

	test('it should initialize with default values', async () => {
		expect(codeTimer.start).to.equal('');
		expect(codeTimer.timer).to.be.undefined;
		expect(codeTimer.id).to.equal('');
		expect(codeTimer.project).to.equal('');
		expect(codeTimer.lang).to.equal('');
		expect(codeTimer.duration).to.deep.equal({
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
		expect(codeTimer.sessions).to.deep.equal([]);
		expect(codeTimer.isSessionActive).to.be.true;
		expect(codeTimer.inactivityThreshold).to.equal(15 * 60 * 1000);
		expect(codeTimer.inactivityTimer).to.be.null;
	});
});

import * as assert from 'assert';
import * as mocha from 'mocha';
import * as vscode from 'vscode';
import { mock, when, anything } from 'ts-mockito';
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

	// TODO: this is not producing mockWorkspace as intended
	// const vscodeMock = mock<typeof vscode.workspace>();
	// const mockWorkspace = mock<vscode.WorkspaceConfiguration>();
	// when(vscodeMock.getConfiguration(anything())).thenReturn(mockWorkspace);
	// when(mockWorkspace.get(anything())).thenReturn('Project 1');

	test('should instantiate with default values', async () => {
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

	test('should initialize with proper values', async () => {
		codeTimer.init(fileOperatorMock);
		expect(codeTimer.start).to.not.equal('');
		expect(codeTimer.timer).to.not.be.undefined;
		expect(codeTimer.id).to.not.equal('');
		expect(codeTimer.project).to.not.equal('');
		expect(codeTimer.lang).to.not.equal('');
		expect(codeTimer.isSessionActive).to.be.true;
		expect(codeTimer.duration).to.deep.equal({
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
		expect(codeTimer.sessions).to.deep.equal([]);
		expect(codeTimer.inactivityThreshold).to.equal(15 * 60 * 1000);
		expect(codeTimer.inactivityTimer).to.not.be.null;
	});

	test('should update status bar with elapsed time', () => {
		const expectedText = 'CodeGroove elapsed: 0:0:1';

		codeTimer.updateStatusBar();

		setTimeout(() => {
			expect(codeTimer.statusBar.text).to.equal(expectedText);
		}, 1000);
	});

	test('should give correct local time in en-US string format', () => {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const expectedStartTime = date.toLocaleString('en-US', {
			timeZone: timeZone,
		});
		const actualStartTime = codeTimer.getCurrentSessionTime();

		expect(actualStartTime).to.equal(expectedStartTime);
	});

	test('should set correct local time as start time state', () => {
		const time = codeTimer.getCurrentSessionTime();
		codeTimer.setStart(time);

		expect(codeTimer.start).to.equal(time);
	});

	test('should create unique, 36 chars length session id', () => {
		const sessionId = codeTimer.getSessionId();

		expect(sessionId).not.to.equal('');
		expect(sessionId.length).to.equal(36);
	});

	test('should set correct session id as state', () => {
		const id = codeTimer.getSessionId();
		codeTimer.setSessionId(id);

		expect(codeTimer.id).to.equal(id);
	});

	test('should return No workspace folder opened if not opened', () => {
		const result = codeTimer.getCurrentProject();

		expect(result).to.equal('No workspace folder opened');
	});
});

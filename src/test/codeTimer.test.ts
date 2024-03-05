import * as vscode from 'vscode';
import { mock, when } from 'ts-mockito';
import { expect } from 'chai';
import { CodeTimer } from '../CodeTimer';
import { FileOperator } from '../FileOperator';

function createMockExtensionContext(): vscode.ExtensionContext {
	return mock<vscode.ExtensionContext>();
}

suite('CodeTimer Test Suite', () => {
	let codeTimer: any;
	let fileOperatorMock: any;

	const extensionContextMock = createMockExtensionContext();
	const fileOperator = new FileOperator(extensionContextMock);
	fileOperatorMock = fileOperator;
	codeTimer = new CodeTimer(fileOperatorMock);

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

	test('should set correct project name as state', () => {
		const project = codeTimer.getCurrentProject();
		codeTimer.setCurrentProject(project);

		expect(codeTimer.project).to.equal(project);
	});

	test('should return No active editor detected if not opened', () => {
		const result = codeTimer.getCurrentLanguage();

		expect(result).to.equal('No active editor detected');
	});

	test('should set correct language as state', () => {
		const language = codeTimer.getCurrentLanguage();
		codeTimer.setCurrentLanguage(language);

		expect(codeTimer.lang).to.equal(language);
	});

	test('calculates correct session duration', (done) => {
		codeTimer.setStart(codeTimer.getCurrentSessionTime());

		setTimeout(async () => {
			const result = await codeTimer.getSessionDuration();
			expect(result).to.deep.equal({ hours: 0, minutes: 0, seconds: 3 });
			done();
		}, 3000);
	});

	test('should set correct duration as state', () => {
		const duration = codeTimer.getSessionDuration();
		codeTimer.setDuration(duration);

		expect(codeTimer.duration).to.equal(duration);
	});

	test('should properly add finished session to sessions array', () => {
		codeTimer.project = 'Project';
		codeTimer.lang = 'Language';
		codeTimer.id = 'id';
		codeTimer.start = '02/27/2024 12:03:00';
		codeTimer.savePreviousSession();
		const lastElementIndex = codeTimer.sessions.length - 1;

		expect(codeTimer.sessions[lastElementIndex].id).to.equal('id');
		expect(codeTimer.sessions[lastElementIndex].project).to.equal(
			'Project',
		);
		expect(codeTimer.sessions[lastElementIndex].start).to.equal(
			'02/27/2024 12:03:00',
		);
		expect(codeTimer.sessions[lastElementIndex].language).to.equal(
			'Language',
		);
	});
});

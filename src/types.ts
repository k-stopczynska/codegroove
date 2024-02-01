export interface Duration {
	hours: string;
	minutes: string;
	seconds: string;
}

export interface Session {
	project: string;
	language: string;
	id: string;
	start: string;
	duration: Duration;
}

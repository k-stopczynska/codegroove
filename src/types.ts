export interface Duration {
	hours: number;
	minutes: number;
	seconds: number;
}

export interface Session {
	project: string;
	language: string;
	id: string;
	start: string;
	duration: Duration;
}

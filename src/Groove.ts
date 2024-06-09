export class Groove {
	private API_KEY = process.env.YOUTUBE_API_KEY;
	private BASE_URI = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=focus&key=${this.API_KEY}`;

	public init() {
		this.utubeFetch();
	}

	private async utubeFetch() {
		try {
			const response = await fetch(this.BASE_URI);
			const data: any = await response.json();
			const videosList = data.items;
			for (const vid of videosList) {
				const channelTitle = vid.snippet.channelTitle;
				const videoTitle = vid.snippet.title;
				const videoUrl = `https://www.youtube.com/watch?v=${vid.id.videoId}`;
				const thumbnail = vid.snippet.thumbnails.default.url;
				console.log(channelTitle, videoTitle, videoUrl, thumbnail);
			}
		} catch (er: any) {
			console.error(er.message);
		}
	}
}

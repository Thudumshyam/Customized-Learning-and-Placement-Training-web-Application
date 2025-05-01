class YouTubePlaylistReader {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    async getPlaylistVideos(playlistId) {
        try {
            const videos = [];
            let nextPageToken = '';

            do {
                const response = await fetch(
                    `${this.baseUrl}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${this.apiKey}&pageToken=${nextPageToken}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch playlist data');
                }

                const data = await response.json();
                
                // Extract video information
                data.items.forEach(item => {
                    videos.push({
                        title: item.snippet.title,
                        videoId: item.snippet.resourceId.videoId,
                        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                        thumbnail: item.snippet.thumbnails.default.url,
                        description: item.snippet.description
                    });
                });

                nextPageToken = data.nextPageToken || '';
            } while (nextPageToken);

            return videos;
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }

    async getPlaylistDetails(playlistId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/playlists?part=snippet&id=${playlistId}&key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch playlist details');
            }

            const data = await response.json();
            return data.items[0].snippet;
        } catch (error) {
            console.error('Error fetching playlist details:', error);
            throw error;
        }
    }
}

// Example usage:
// const playlistReader = new YouTubePlaylistReader('YOUR_API_KEY');
// const playlistId = 'PLAYLIST_ID';
// 
// playlistReader.getPlaylistVideos(playlistId)
//     .then(videos => {
//         console.log('Playlist videos:', videos);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     }); 
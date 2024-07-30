const vscode = acquireVsCodeApi();
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('.player');

    iframes.forEach((iframe) => {
        const handlePlayOnLoad = (event) => {
            const videoUrl = iframe.getAttribute('src');
            vscode.postMessage({ command: 'openLink', videoUrl });

            const largePlayButton = iframe.querySelector('.ytp-large-play-button');
            largePlayButton.classList.toggle('active');

            iframe.removeEventListener('click', handlePlayOnLoad);

            const playButton = iframe.querySelector('.ytp-play-button');
            const playIcon = playButton.querySelector('.play-icon');
            const pauseIcon = playButton.querySelector('.pause-icon');

            playButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'togglePlay' });
                playIcon.classList.toggle('hidden');
                pauseIcon.classList.toggle('hidden');
                });

            const muteButton = iframe.querySelector('.ytp-mute-button');
            const unmuteIcon = muteButton.querySelector('.unmute-icon');
            const muteIcon = muteButton.querySelector('.mute-icon');

            muteButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'toggleMute' });
                unmuteIcon.classList.toggle('hidden');
                muteIcon.classList.toggle('hidden');
                });
            }
        iframe.addEventListener('click', handlePlayOnLoad);
        });
    });


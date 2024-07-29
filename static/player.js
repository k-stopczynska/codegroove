const vscode = acquireVsCodeApi();
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('.player');

    iframes.forEach((iframe) => {
        const handlePlayOnLoad = (event) => {
            const videoUrl = iframe.getAttribute('src');
            vscode.postMessage({ command: 'openLink', videoUrl });

            const largePlayButton = iframe.querySelector('.ytp-large-play-button');
            largePlayButton.style.display = 'none';

            iframe.removeEventListener('click', handlePlayOnLoad);

            const playButton = iframe.querySelector('.ytp-play-button');
            playButton.addEventListener('click', () => vscode.postMessage({ command: 'togglePlay'}));

            const muteButton = iframe.querySelector('.ytp-mute-button');
            muteButton.addEventListener('click', () => vscode.postMessage({ command: 'toggleMute'}));
        }
        iframe.addEventListener('click', handlePlayOnLoad);
        });
    });


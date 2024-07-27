const vscode = acquireVsCodeApi();
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('.player');

    iframes.forEach((iframe) => {
        iframe.addEventListener('click', (event) => {
            const videoUrl = iframe.getAttribute('src');
            vscode.postMessage({ command: 'openLink', videoUrl });

            const playButton = iframe.querySelector('.ytp-large-play-button');
            playButton.style.display = 'none';
        });
    });
});

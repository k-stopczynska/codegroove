const vscode = acquireVsCodeApi();
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('.player');

    iframes.forEach((iframe) => {
        iframe.addEventListener('click', (event) => {
            console.log('iframe clicked!')
            const videoUrl = iframe.getAttribute('src');
            vscode.postMessage({ command: 'openLink', videoUrl });
        });
    });
});

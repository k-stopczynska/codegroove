/**
 * defines and envokes initializing charts function that takes data from webview element, and creates Chart instance of provided type, labels and datasets
 */

(function initializeCharts() {
  const data = JSON.parse(document.querySelector('.section__container').getAttribute('data'));
  data.forEach((stat, index) => {
    new Chart(
      document.getElementById('chart' + (index + 1)),
      {
        type: stat.type,
        data: {
          labels: Object.keys(stat).filter((item) => item !== 'type'),
          datasets: [
            {
              label: 'coding hours',
              data: Object.values(stat).filter((item) => !isNaN(item)),
              backgroundColor: getColors(),
              borderColor: stat.type === 'line' && 'rgb(255, 188, 255)',
              borderWidth: stat.type === 'line' ? 2 : 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
                useBorderRadius: true,
                borderRadius: 4
              }
            },
          },
          pointBackgroundColor: 'rgb(187, 41, 137)',
          borderRadius: 4,
          tension: .3,
          scales: {
            y: {
              ticks: {
                color: document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
              },
            },
            x: {
              ticks: {
                color: document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
              },
            }
          },
        }
      }
    );
  });
})();

function getColors() {
  return [
    '#9EA1D4',
    'rgb(255, 188, 255)',
    '#7EC1DF',
    '#EDF784',
    '#FD8A8A',
    '#B0EBEB'
  ];
}

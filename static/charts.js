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
              backgroundColor: stat.type === 'bar' && getBarColors(),
              borderColor: stat.type === 'line' && 'rgb(187, 41, 137)',
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
                color: document.body.classList.contains('vscode-dark') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
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
                color: document.body.classList.contains('vscode-dark') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
              },
            },
            x: {
              ticks: {
                color: document.body.classList.contains('vscode-dark') ? "rgb(250, 245, 245)" : 'rgb(19, 14, 34)',
              },
            }
          },
        }
      }
    );
  });
})();

function getBarColors() {
  return [
    'rgb(187, 41, 137)',
    'rgba(54, 162, 235)',
    'rgba(255, 206, 86)',
    'rgba(75, 192, 192)',
    'rgba(153, 102, 255)',
    'rgba(255, 159, 64)'
  ];
}

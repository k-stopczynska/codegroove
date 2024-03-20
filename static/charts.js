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
                color: getTickAndLabelColor(),
                usePointStyle: true,
                pointStyle: 'rectRounded',
              }
            },
          },
          pointBackgroundColor: 'rgb(187, 41, 137)',
          borderRadius: 4,
          tension: .3,
          scales: {
            y: {
              ticks: {
                color: getTickAndLabelColor(),
              },
            },
            x: {
              ticks: {
                color: getTickAndLabelColor(),
              },
            }
          },
        }
      }
    );
  });
})();

Chart.overrides.doughnut.plugins.legend = {
  labels: {
    color: 'red', // Customize label color for doughnut chart
    usePointStyle: true,
    useBorderRadius: true,
    borderRadius: 4
  }
};

function getColors() {
  return [
    'rgb(158, 161, 212)',
    'rgb(255, 188, 255)',
    'rgb(126, 193, 223)',
    'rgb(237, 247, 132)',
    'rgb(253, 138, 138)',
    'rgb(176, 235, 235)'
  ];
}

function getTickAndLabelColor() {
  return document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast') ? 'rgb(250, 245, 245)' : 'rgb(19, 14, 34)'
}

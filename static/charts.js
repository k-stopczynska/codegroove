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
              label: 'hours spent',
              data: Object.values(stat).filter((item) => !isNaN(item)),
            },
          ],
        },
      }
    );
  });
})();



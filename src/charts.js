(function initializeCharts() {
  const data = JSON.parse(document.querySelector('.section__container').getAttribute('data'));
  data.forEach((stat, index) => {
    new Chart(
      document.getElementById('chart' + (index + 1)),
      {
        type: 'bar',
        data: {
          labels: Object.keys(stat),
          datasets: [
            {
              label: 'stats per hour',
              data: Object.values(stat),
            },
          ],
        },
      }
    );
  });
})();

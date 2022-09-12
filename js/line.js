window.addEventListener('load', setup);
   async function setup() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const dataTemps = await getData();

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataTemps.team_alias,
        datasets: [
          {
            label: 'Seat Quantity',
            data: dataTemps.seat_quantity,
            fill: false,
            borderColor: 'rgba(75,192,192)',
            borderWidth: 1,
            tension:0.1
            
          }
        ]
      },
      options: {
        responsive:false
      }
    });
  }
    async function getData() {
    const response = await fetch('all.csv');
    const data = await response.text();
    const team_alias = [];
    const seat_quantity = [];

    const rows = data.split('\n').slice(1);
    rows.forEach(row => {
      const cols = row.split(',');
      team_alias.push(cols[0]);
      seat_quantity.push(cols[9]);

    });
    return { team_alias, seat_quantity };   
  }
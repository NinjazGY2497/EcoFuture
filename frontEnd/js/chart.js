const ctx = document.getElementById('geminiChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], 
        datasets: [{
            label: 'Population Trend',
            data: [],
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            x: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        plugins: {
            legend: { labels: { color: '#ffffff' } }
        }
    }
});

function updateChartWithAI(aiResponse) {
    try {
        const jsonString = aiResponse.replace(/```json|```/gi, '').trim();
        const cleanData = JSON.parse(jsonString);
        myChart.data.labels = cleanData.labels;
        myChart.data.datasets[0].data = cleanData.values;
        myChart.update();
    } catch (error) {
        console.error(error);
    }
}
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
            plugins: {
                legend: { labels: { color: '#ffffff' } },
                title: {
                    display: true,
                    text: `Population Analysis`,
                    color: '#ffffff',
                    font: { size: 18 }
                }
            },
            scales: {
                y: { 
                    title: {
                        display: true,
                        text: 'Population Count',
                        color: '#ffffff'
                    },
                    ticks: { color: '#ffffff' }, 
                    grid: { color: 'rgba(255, 255, 255, 0.1)' } 
                },
                x: { 
                    title: {
                        display: true,
                        text: 'Time Period',
                        color: '#ffffff'
                    },
                    ticks: { color: '#ffffff' }, 
                    grid: { color: 'rgba(255, 255, 255, 0.1)' } 
                }
            }
        }
    });

export function updateChartWithAI(aiResponse, animal) {
    try {
        const graphData = aiResponse
        myChart.data.labels = graphData.labels;
        myChart.data.datasets[0].data = graphData.values;
        myChart.update();
    } catch (error) {
        console.error(error);
    }
}
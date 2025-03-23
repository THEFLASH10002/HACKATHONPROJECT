console.log("JavaScript is working!");

// --- Smooth Scroll ---
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// --- Helper Functions ---
function getStatus(vitals) {
    const { hr, bpS, bpD, spo2 } = vitals;
    const hrOk = hr >= 60 && hr <= 100;
    const bpOk = bpS >= 90 && bpS <= 120 && bpD >= 60 && bpD <= 80;
    const spo2Ok = spo2 >= 95;
    const okCount = [hrOk, bpOk, spo2Ok].filter(Boolean).length;

    if (okCount === 3) return 'healthy';
    if (okCount === 2) return 'warning';
    return 'critical';
}

function calculateRiskScore(vitals) {
    const { hr, bpS, bpD, spo2 } = vitals;
    let score = 0;

    if (hr < 60 || hr > 100) score += 10;
    if (bpS < 90 || bpS > 130) score += 10;
    if (bpD < 60 || bpD > 85) score += 10;
    if (spo2 < 94) score += 10;

    if ((hr < 60 || hr > 100) && spo2 < 94 && (bpS < 90 || bpS > 130)) {
        score += 10; // composite penalty
    }

    return score; // out of 50
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Chart Setup ---
let combinedChart;
function initCombinedChart() {
    const ctx = document.getElementById('combined-chart').getContext('2d');
    combinedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Avg Heart Rate (BPM)',
                    data: [],
                    borderColor: '#ff5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Avg SpO₂ (%)',
                    data: [],
                    borderColor: '#33cc33',
                    backgroundColor: 'rgba(51, 204, 51, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

function updateCombinedChart(billy, ava, zara) {
    const time = new Date().toLocaleTimeString();
    const avgHR = Math.round((billy.hr + ava.hr + zara.hr) / 3);
    const avgSpO2 = Math.round((billy.spo2 + ava.spo2 + zara.spo2) / 3);

    const maxPoints = 12;
    const labels = combinedChart.data.labels;
    const hrData = combinedChart.data.datasets[0].data;
    const spo2Data = combinedChart.data.datasets[1].data;

    if (labels.length >= maxPoints) {
        labels.shift(); hrData.shift(); spo2Data.shift();
    }

    labels.push(time);
    hrData.push(avgHR);
    spo2Data.push(avgSpO2);

    combinedChart.update();
}
document.addEventListener("DOMContentLoaded", function () {
    initCombinedChart();
    updateVitals();
    setInterval(updateVitals, 3000); // updates every 3 seconds
});
// --- Live Vitals ---
function updateVitals() {
    const patients = [
        {
            key: 'billy',
            vitals: {
                hr: getRandomInt(60, 100),
                bpS: getRandomInt(90, 130),
                bpD: getRandomInt(60, 85),
                spo2: getRandomInt(93, 100)
            }
        },
        {
            key: 'ava',
            vitals: {
                hr: getRandomInt(60, 110),
                bpS: getRandomInt(88, 140),
                bpD: getRandomInt(58, 90),
                spo2: getRandomInt(92, 100)
            }
        },
        {
            key: 'zara',
            vitals: {
                hr: getRandomInt(58, 105),
                bpS: getRandomInt(85, 135),
                bpD: getRandomInt(55, 88),
                spo2: getRandomInt(90, 100)
            }
        }
    ];

    patients.forEach(({ key, vitals }) => {
        // Update vitals text
        document.getElementById(`hr-${key}`).textContent = vitals.hr;
        document.getElementById(`bp-${key}`).textContent = `${vitals.bpS}/${vitals.bpD}`;
        document.getElementById(`spo2-${key}`).textContent = vitals.spo2;

        // Calculate and display risk
        const risk = calculateRiskScore(vitals);
        document.getElementById(`risk-${key}`).textContent = `Risk Score: ${risk}`;

        // Update aura class
        const banner = document.querySelector(`.hero-banner.${key}`);
        banner.classList.remove('healthy', 'warning', 'critical');

        if (risk <= 20) {
            banner.classList.add('healthy');
        } else if (risk <= 40) {
            banner.classList.add('warning');
        } else {
            banner.classList.add('critical');
        }
    });

    // Update the chart
    updateCombinedChart(
        patients[0].vitals,
        patients[1].vitals,
        patients[2].vitals
    );


    
}


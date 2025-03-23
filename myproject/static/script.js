console.log("JavaScript is working!");

// Smooth Scroll
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: "smooth" });
        } else {
            console.warn(`Element with ID '${targetId}' not found. Skipping scroll.`);
        }
    });
});

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function updateCombinedChart(billy, ava, zara) {
    const time = new Date().toLocaleTimeString();
    const avgHR = Math.round((billy.hr + ava.hr + zara.hr) / 3);
    const avgSpO2 = Math.round((billy.spo2 + ava.spo2 + zara.spo2) / 3);

    const maxDataPoints = 12;
    const labels = combinedChart.data.labels;
    const hrData = combinedChart.data.datasets[0].data;
    const spo2Data = combinedChart.data.datasets[1].data;

    if (labels.length >= maxDataPoints) {
        labels.shift();
        hrData.shift();
        spo2Data.shift();
    }

    labels.push(time);
    hrData.push(avgHR);
    spo2Data.push(avgSpO2);

    combinedChart.update();
}

function updateVitals() {
    const billyVitals = {
        hr: getRandomInt(60, 100),
        bpS: getRandomInt(90, 130),
        bpD: getRandomInt(60, 85),
        spo2: getRandomInt(93, 100)
    };

    const avaVitals = {
        hr: getRandomInt(60, 110),
        bpS: getRandomInt(88, 140),
        bpD: getRandomInt(58, 90),
        spo2: getRandomInt(92, 100)
    };

    const zaraVitals = {
        hr: getRandomInt(58, 105),
        bpS: getRandomInt(85, 135),
        bpD: getRandomInt(55, 88),
        spo2: getRandomInt(90, 100)
    };

    const patients = [
        { key: 'billy', vitals: billyVitals },
        { key: 'ava', vitals: avaVitals },
        { key: 'zara', vitals: zaraVitals }
    ];

    patients.forEach(({ key, vitals }) => {
        document.getElementById(`hr-${key}`).textContent = vitals.hr;
        document.getElementById(`bp-${key}`).textContent = `${vitals.bpS}/${vitals.bpD}`;
        document.getElementById(`spo2-${key}`).textContent = vitals.spo2;

        const banner = document.querySelector(`.hero-banner.${key}`);
        banner.classList.remove('healthy', 'warning', 'critical');
        banner.classList.add(getStatus(vitals));
    });

    updateCombinedChart(billyVitals, avaVitals, zaraVitals);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded");

    initCombinedChart();
    updateVitals();
    setInterval(updateVitals, 3000);

    function toggleChatbot() {
        const chatbotBox = document.getElementById("chatbot-container");
        chatbotBox.style.display = chatbotBox.style.display === "none" ? "block" : "none";
    }

    async function sendMessage() {
        let userInput = document.getElementById("userInput").value.trim();
        let chatbox = document.getElementById("chatbox");

        if (userInput === "") return;

        chatbox.innerHTML += `<p style="text-align: right;"><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("userInput").value = "";

        try {
            let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer YOUR_API_KEY",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct",
                    messages: [{ role: "user", content: userInput }]
                })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            let data = await response.json();
            let botReply = data.choices?.[0]?.message?.content || "I'm still learning. Can you rephrase?";
            chatbox.innerHTML += `<p style="text-align: left;"><strong>Bot:</strong> ${botReply}</p>`;

        } catch (error) {
            console.error("Error fetching AI response:", error);
            chatbox.innerHTML += `<p style="text-align: left; color: red;"><strong>Bot:</strong> Error: Could not get a response.</p>`;
        }

        chatbox.scrollTop = chatbox.scrollHeight;
    }

    document.getElementById("chatbot-icon").addEventListener("click", toggleChatbot);
    document.getElementById("userInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    window.sendMessage = sendMessage;
    window.toggleChatbot = toggleChatbot;
});

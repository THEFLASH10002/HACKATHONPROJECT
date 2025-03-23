console.log("JavaScript is working!");
// Load alert sound
// Load alert sound


let userInteracted = false;
const alertSound = new Audio("/static/sounds/alert.mp3");

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
    if ((hr < 60 || hr > 100) && spo2 < 94 && (bpS < 90 || bpS > 130)) score += 10;
    return score;
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

// --- Live Vitals ---
function updateVitals() {
    const patients = [
        {
            key: 'billy',
            vitals: {
                hr: getRandomInt(65, 95),
                bpS: getRandomInt(92, 125),
                bpD: getRandomInt(62, 85),
                spo2: getRandomInt(95, 99)
            }
        },
        {
            key: 'ava',
            vitals: {
                hr: getRandomInt(63, 100),
                bpS: getRandomInt(90, 130),
                bpD: getRandomInt(60, 90),
                spo2: getRandomInt(94, 100)
            }
        },
        {
            key: 'zara',
            vitals: {
                hr: getRandomInt(60, 100),
                bpS: getRandomInt(88, 128),
                bpD: getRandomInt(60, 85),
                spo2: getRandomInt(93, 99)
            }
        }
    ];

    patients.forEach(({ key, vitals }) => {
        document.getElementById(`hr-${key}`).textContent = vitals.hr;
        document.getElementById(`bp-${key}`).textContent = `${vitals.bpS}/${vitals.bpD}`;
        document.getElementById(`spo2-${key}`).textContent = vitals.spo2;

        const risk = calculateRiskScore(vitals);
        document.getElementById(`risk-${key}`).textContent = `Risk Score: ${risk}`;

        const banner = document.querySelector(`.hero-banner.${key}`);
        banner.classList.remove('healthy', 'warning', 'critical');
        banner.classList.add(getStatus(vitals));

        fetch("/api/predict/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vitals)
        })
        .then(res => res.json())
        .then(data => {
            const pred = data.risk_level;
            const statusElem = document.getElementById(`status-${key}`);
            if (!statusElem) return;

            if (pred === 0) {
                statusElem.textContent = "🟢 Predicted: Healthy";
                statusElem.style.color = "green";
            } else if (pred === 1) {
                statusElem.textContent = "🟠 Predicted: Warning";
                statusElem.style.color = "orange";
                alertSound.play(); // 🔊 Play sound
                alert(`⚠️ ${key.toUpperCase()} is in a warning state! Check vitals soon.`);
            } else {
                statusElem.textContent = "🔴 Predicted: Critical";
                statusElem.style.color = "red";
                alertSound.play(); // 🔊 Play sound
                alert(`🚨 CRITICAL: ${key.toUpperCase()} needs urgent attention!`);
            }
            
        });
    });

    updateCombinedChart(
        patients[0].vitals,
        patients[1].vitals,
        patients[2].vitals
    );
}

// --- Chatbot Toggle ---
function toggleChatbot() {
    const chatbotBox = document.getElementById("chatbot-container");
    chatbotBox.style.display = chatbotBox.style.display === "none" ? "block" : "none";
}
window.toggleChatbot = toggleChatbot; // ✅ make available to HTML

// --- Chatbot Message ---
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
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: userInput }]
            })
        });

        let data = await response.json();
        let botReply = data.choices?.[0]?.message?.content || "I'm still learning. Can you rephrase?";
        chatbox.innerHTML += `<p style="text-align: left;"><strong>Bot:</strong> ${botReply}</p>`;
    } catch (error) {
        console.error("Chatbot error:", error);
        chatbox.innerHTML += `<p style="text-align: left; color: red;"><strong>Bot:</strong> Could not get a response.</p>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}

// --- Init ---
document.addEventListener("DOMContentLoaded", function () {
    console.log("Vitals system loaded ✅");
    initCombinedChart();
    updateVitals();
    setInterval(updateVitals, 10000);

    document.getElementById("chatbot-icon")?.addEventListener("click", toggleChatbot);
    document.getElementById("userInput")?.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
        document.addEventListener("click", () => {
            userInteracted = true;
        }, { once: true });
        
        document.addEventListener("keydown", () => {
            userInteracted = true;
        }, { once: true });
        
    });
});

console.log("JavaScript is working!");

// Smooth Scroll
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        // ✅ Check if target element exists before scrolling
        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: "smooth" });
        } else {
            console.warn(`Element with ID '${targetId}' not found. Skipping scroll.`);
        }
    });
});

// Simulated live vitals updater
function updateVitals() {
    // === BILLY ===
    const billyVitals = {
        hr: getRandomInt(60, 100),
        bpS: getRandomInt(90, 130),
        bpD: getRandomInt(60, 85),
        spo2: getRandomInt(93, 100)
    };

    document.getElementById('hr-billy').textContent = billyVitals.hr;
    document.getElementById('bp-billy').textContent = `${billyVitals.bpS}/${billyVitals.bpD}`;
    document.getElementById('spo2-billy').textContent = billyVitals.spo2;

    const billyStatus = getStatus(billyVitals);
    const billyBanner = document.querySelector('.hero-banner.billy');
    billyBanner.classList.remove('healthy', 'warning', 'critical');
    billyBanner.classList.add(billyStatus);

    // === AVA ===
    const avaVitals = {
        hr: getRandomInt(60, 110),
        bpS: getRandomInt(88, 140),
        bpD: getRandomInt(58, 90),
        spo2: getRandomInt(92, 100)
    };

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
    

    document.getElementById('hr-ava').textContent = avaVitals.hr;
    document.getElementById('bp-ava').textContent = `${avaVitals.bpS}/${avaVitals.bpD}`;
    document.getElementById('spo2-ava').textContent = avaVitals.spo2;

    const avaStatus = getStatus(avaVitals);
    const avaBanner = document.querySelector('.hero-banner.ava');
    avaBanner.classList.remove('healthy', 'warning', 'critical');
    avaBanner.classList.add(avaStatus);

    // === ZARA ===
    const zaraVitals = {
        hr: getRandomInt(58, 105),
        bpS: getRandomInt(85, 135),
        bpD: getRandomInt(55, 88),
        spo2: getRandomInt(90, 100)
    };

    document.getElementById('hr-zara').textContent = zaraVitals.hr;
    document.getElementById('bp-zara').textContent = `${zaraVitals.bpS}/${zaraVitals.bpD}`;
    document.getElementById('spo2-zara').textContent = zaraVitals.spo2;

    const zaraStatus = getStatus(zaraVitals);
    const zaraBanner = document.querySelector('.hero-banner.zara');
    zaraBanner.classList.remove('healthy', 'warning', 'critical');
    zaraBanner.classList.add(zaraStatus);
}


// Helper function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Start the live update loop
setInterval(updateVitals, 3000);



// Start the animation
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded");

    // Toggle Chatbot Visibility
    function toggleChatbot() {
        const chatbotBox = document.getElementById("chatbot-container");
        chatbotBox.style.display = chatbotBox.style.display === "none" ? "block" : "none";
    }

    // AI Chatbot Functionality
    async function sendMessage() {
        let userInput = document.getElementById("userInput").value.trim();
        let chatbox = document.getElementById("chatbox");

        if (userInput === "") return; // Prevent empty messages

        // Display user message
        chatbox.innerHTML += `<p style="text-align: right;"><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("userInput").value = ""; // Clear input

        try {
            // ✅ Correct API Endpoint
            let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Authorization": "Bearer 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", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct", // ✅ Use a valid OpenRouter model
                    messages: [{ role: "user", content: userInput }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log("API Response:", data);

            // ✅ Extract the correct chatbot response format
            let botReply = data.choices?.[0]?.message?.content || "I'm still learning. Can you rephrase?";
            
            // Display bot response
            chatbox.innerHTML += `<p style="text-align: left;"><strong>Bot:</strong> ${botReply}</p>`;

        } catch (error) {
            console.error("Error fetching AI response:", error);
            chatbox.innerHTML += `<p style="text-align: left; color: red;"><strong>Bot:</strong> Error: Could not get a response.</p>`;
        }

        chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll
    }


    // Attach event listeners
    document.getElementById("chatbot-icon").addEventListener("click", toggleChatbot);
    document.getElementById("userInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // ✅ Make functions globally available
    window.sendMessage = sendMessage;
    window.toggleChatbot = toggleChatbot;


});

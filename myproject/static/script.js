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


/* =========================================
   TOTAL CRYPTO HUB - AI ASSISTANT
   Chat, interactions and robot reactions
========================================= */

(() => {
  "use strict";

  const SCRIPT = document.currentScript;
  const SCRIPT_URL = SCRIPT ? SCRIPT.src : window.location.href;
  const BASE_URL = new URL(".", SCRIPT_URL);

  const HTML_URL = new URL("assistant.html", BASE_URL);
  const CSS_URL = new URL("assistant.css", BASE_URL);

  function loadStyles() {
    if (document.querySelector('[data-tcn-assistant-css]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_URL.href;
    link.dataset.tcnAssistantCss = "true";
    document.head.appendChild(link);
  }

  function addMessage(text, sender) {
    const messages = document.getElementById("tcnAiMessages");
    if (!messages) return;

    const wrapper = document.createElement("div");
    wrapper.className = sender === "user"
      ? "tcn-ai-message tcn-ai-user-message"
      : "tcn-ai-message tcn-ai-bot-message";

    if (sender !== "user") {
      const avatar = document.createElement("div");
      avatar.className = "tcn-ai-message-avatar";
      avatar.textContent = "🤖";
      wrapper.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "tcn-ai-message-content";

    // Use textContent to prevent HTML injection.
    content.textContent = text;

    wrapper.appendChild(content);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  function getAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes("hello") || q.includes("hi") || q.includes("नमस्ते")) {
      return "नमस्ते! 👋 Total Crypto Hub में आपका स्वागत है। मैं आपकी क्या मदद कर सकता हूँ?";
    }

    if (q.includes("depin")) {
      return "DePIN का पूरा नाम Decentralized Physical Infrastructure Networks है। इसमें लोग अपनी physical infrastructure जैसे wireless networks, storage और computing power को blockchain आधारित नेटवर्क से जोड़ते हैं।";
    }

    if (q.includes("airdrop")) {
      return "Crypto Airdrop में किसी प्रोजेक्ट के टोकन मुफ्त में मिल सकते हैं। हमेशा official website और verified social accounts जाँचें। कभी भी अपनी seed phrase या private key साझा न करें।";
    }

    if (q.includes("token") || q.includes("checker")) {
      return "Token Checker से किसी टोकन की जानकारी और उपलब्ध सुरक्षा संकेतों की जाँच कर सकते हैं। केवल checker के परिणाम पर भरोसा करके निवेश न करें।";
    }

    if (q.includes("earning") || q.includes("calculator")) {
      return "Earning Calculator में अपनी investment, अनुमानित reward और समय डालकर संभावित earning का हिसाब लगा सकते हैं। यह केवल अनुमान है, guaranteed profit नहीं।";
    }

    if (q.includes("wallet")) {
      return "Crypto wallet आपकी digital assets को manage करने में मदद करता है। Wallet चुनते समय security, official source और seed phrase की सुरक्षा का ध्यान रखें।";
    }

    if (q.includes("bitcoin")) {
      return "Bitcoin एक decentralized digital currency है। इसकी कीमत में काफी उतार-चढ़ाव हो सकता है, इसलिए निवेश से पहले खुद research करें।";
    }

    if (q.includes("contact") || q.includes("support") || q.includes("help")) {
      return "आप Total Crypto Hub के Contact पेज के माध्यम से टीम से संपर्क कर सकते हैं। कृपया किसी के साथ अपनी private key या OTP साझा न करें।";
    }

    return "अच्छा सवाल है! 😊 मैं अभी बेसिक offline assistant हूँ। इस सवाल का जवाब मेरे पास उपलब्ध नहीं है। आप Total Crypto Hub के संबंधित सेक्शन में जानकारी देख सकते हैं।";
  }

  function setRobotReaction(type) {
    const robot = document.getElementById("tcnAiRobot");
    if (!robot) return;

    robot.dataset.reaction = type;

    clearTimeout(robot._reactionTimer);

    robot._reactionTimer = setTimeout(() => {
      robot.dataset.reaction = "normal";
    }, 1200);
  }

  function openChat() {
    const windowEl = document.getElementById("tcnAiWindow");
    if (!windowEl) return;

    windowEl.classList.add("active");
    windowEl.setAttribute("aria-hidden", "false");

    setRobotReaction("happy");

    const input = document.getElementById("tcnAiInput");
    if (input) {
      setTimeout(() => input.focus(), 200);
    }
  }

  function closeChat() {
    const windowEl = document.getElementById("tcnAiWindow");
    if (!windowEl) return;

    windowEl.classList.remove("active");
    windowEl.setAttribute("aria-hidden", "true");

    setRobotReaction("normal");
  }

  function handleSend(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    addMessage(cleanQuestion, "user");
    setRobotReaction("thinking");

    const input = document.getElementById("tcnAiInput");
    if (input) input.value = "";

    // Offline response. A secure backend can be connected later.
    setTimeout(() => {
      addMessage(getAnswer(cleanQuestion), "bot");
      setRobotReaction("happy");
    }, 650);
  }

  function setupAssistant() {
    loadStyles();

    const robot = document.getElementById("tcnAiRobot");
    const form = document.getElementById("tcnAiForm");

    if (!robot || !form) return;

    robot.addEventListener("click", () => {
      const windowEl = document.getElementById("tcnAiWindow");

      if (windowEl && windowEl.classList.contains("active")) {
        closeChat();
      } else {
        openChat();
      }
    });

    const closeButton = document.getElementById("tcnAiClose");
    if (closeButton) {
      closeButton.addEventListener("click", closeChat);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = document.getElementById("tcnAiInput");
      if (input) handleSend(input.value);
    });

    const suggestions = document.querySelectorAll(
      "#tcnAiMessages [data-question]"
    );

    suggestions.forEach((button) => {
      button.addEventListener("click", () => {
        handleSend(button.dataset.question || "");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeChat();
    });

    setRobotReaction("happy");
  }

  async function initializeAssistant() {
    if (document.getElementById("tcn-ai-assistant")) {
      setupAssistant();
      return;
    }

    try {
      loadStyles();

      const response = await fetch(HTML_URL.href);

      if (!response.ok) {
        throw new Error("Assistant HTML could not be loaded.");
      }

      const html = await response.text();

      const container = document.createElement("div");
      container.innerHTML = html;

      const assistant = container.querySelector("#tcn-ai-assistant");

      if (!assistant) {
        throw new Error("Assistant root element was not found.");
      }

      document.body.appendChild(assistant);
      setupAssistant();

    } catch (error) {
      console.error("Total Crypto Hub Assistant:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAssistant, {
      once: true
    });
  } else {
    initializeAssistant();
  }
})();


(() => {
  "use strict";

  const script = document.currentScript;
  if (!script) return;

  const baseURL = new URL(".", script.src);
  const htmlURL = new URL("assistant.html", baseURL);
  const cssURL = new URL("assistant.css", baseURL);

  // CSS को पेज में लोड करें
  if (!document.querySelector('[data-tcn-ai-css]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL.href;
    link.dataset.tcnAiCss = "true";
    document.head.appendChild(link);
  }

  // Assistant HTML लोड करें
  fetch(htmlURL.href)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Assistant HTML could not be loaded.");
      }
      return response.text();
    })
    .then((html) => {
      if (document.getElementById("tcn-ai-assistant")) return;

      document.body.insertAdjacentHTML("beforeend", html);
      initializeAssistant();
    })
    .catch((error) => {
      console.error("TCN Assistant:", error);
    });

  function initializeAssistant() {
    const robot = document.getElementById("tcnAiRobot");
    const windowBox = document.getElementById("tcnAiWindow");
    const closeButton = document.getElementById("tcnAiClose");
    const form = document.getElementById("tcnAiForm");
    const input = document.getElementById("tcnAiInput");
    const messages = document.getElementById("tcnAiMessages");
    const suggestions = document.querySelector(".tcn-ai-suggestions");

    if (!robot || !windowBox || !form || !input || !messages) return;

    // Chat window खोलना और बंद करना
    function openAssistant() {
      windowBox.classList.add("is-open");
      robot.classList.add("is-active");
      windowBox.setAttribute("aria-hidden", "false");
      input.focus();
    }

    function closeAssistant() {
      windowBox.classList.remove("is-open");
      robot.classList.remove("is-active");
      windowBox.setAttribute("aria-hidden", "true");
    }

    robot.addEventListener("click", openAssistant);

    if (closeButton) {
      closeButton.addEventListener("click", closeAssistant);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAssistant();
    });

    // Chat में message दिखाना
    function addMessage(message, sender) {
      const bubble = document.createElement("div");
      bubble.className = `tcn-ai-message tcn-ai-message-${sender}`;
      bubble.textContent = message;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    // फिलहाल शुरुआती offline जवाब
    // असली AI जवाब के लिए सुरक्षित backend/API जोड़ना होगा।
    function getReply(question) {
      const q = question.toLowerCase();

      if (q.includes("depin")) {
        return "DePIN का मतलब Decentralized Physical Infrastructure Networks है। इसमें लोग अपने hardware और resources के जरिए decentralized networks को support कर सकते हैं। Total Crypto Hub के DePIN Projects सेक्शन में आप संबंधित projects देख सकते हैं।";
      }

      if (q.includes("airdrop") || q.includes("campaign")) {
        return "Airdrops और Campaigns में crypto projects users को tasks, participation या community activities के बदले rewards दे सकते हैं। किसी भी campaign में भाग लेने से पहले उसकी official website और eligibility जरूर जाँचें।";
      }

      if (q.includes("wallet") || q.includes("exchange")) {
        return "Crypto wallet का इस्तेमाल digital assets को manage करने के लिए किया जाता है। Exchange पर आप crypto assets खरीद या बेच सकते हैं। हमेशा official links और security details verify करें।";
      }

      if (q.includes("token") || q.includes("checker")) {
        return "Token Checker का उपयोग किसी token की जानकारी जाँचने के लिए किया जा सकता है। सही blockchain network और contract address verify करना जरूरी है।";
      }

      if (q.includes("earning") || q.includes("calculator")) {
        return "Earning Calculator अनुमानित earnings समझने में मदद कर सकता है। ध्यान रखें कि वास्तविक कमाई network rewards, token price और अन्य परिस्थितियों पर निर्भर करती है।";
      }

      if (q.includes("hello") || q.includes("hi") || q.includes("नमस्ते")) {
        return "नमस्ते! 😊 Total Crypto Hub में आपका स्वागत है। बताइए, मैं आपकी किस प्रकार सहायता कर सकता हूँ?";
      }

      return "आपका सवाल मिल गया! 😊 अभी मेरा शुरुआती चैट मोड चालू है। असली AI से जवाब दिलाने के लिए हमें सुरक्षित backend/API जोड़ना होगा। फिलहाल आप DePIN, Airdrops, Wallets या Token Checker के बारे में पूछ सकते हैं।";
    }

    // User का message भेजना
    function sendMessage(message) {
      const question = message.trim();
      if (!question) return;

      addMessage(question, "user");
      input.value = "";

      window.setTimeout(() => {
        addMessage(getReply(question), "bot");
      }, 500);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });

    // Suggested questions पर क्लिक
    if (suggestions) {
      suggestions.addEventListener("click", (event) => {
        const button = event.target.closest("[data-question]");
        if (!button) return;

        openAssistant();
        sendMessage(button.dataset.question);
      });
    }

    // Robot को drag करके स्क्रीन पर दूसरी जगह रखना
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    robot.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      dragging = true;
      moved = false;

      const rect = robot.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      robot.style.right = "auto";
      robot.style.bottom = "auto";
      robot.style.left = `${rect.left}px`;
      robot.style.top = `${rect.top}px`;

      robot.setPointerCapture(event.pointerId);
    });

    robot.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        moved = true;
      }

      if (!moved) return;

      const maxLeft = window.innerWidth - robot.offsetWidth;
      const maxTop = window.innerHeight - robot.offsetHeight;

      const left = Math.max(0, Math.min(maxLeft, initialLeft + dx));
      const top = Math.max(0, Math.min(maxTop, initialTop + dy));

      robot.style.left = `${left}px`;
      robot.style.top = `${top}px`;
    });

    robot.addEventListener("pointerup", () => {
      dragging = false;

      if (moved) {
        robot.dataset.dragged = "true";
        window.setTimeout(() => {
          delete robot.dataset.dragged;
        }, 250);
      }
    });

    robot.addEventListener("click", (event) => {
      if (robot.dataset.dragged === "true") {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }, true);
  }
})();

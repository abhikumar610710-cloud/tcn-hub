
/* =========================================
   TOTAL CRYPTO HUB
   TCN AI GIRL ASSISTANT
   Main Controller
========================================= */

(function () {
  "use strict";

  const scriptElement = document.currentScript;

  if (!scriptElement || !scriptElement.src) {
    console.error("TCN AI: Assistant script URL not found.");
    return;
  }

  const assistantBase = new URL(".", scriptElement.src);

  const HTML_URL = new URL("assistant.html", assistantBase);
  const CSS_URL = new URL("assistant.css", assistantBase);

  const IDLE_TIME = 5000;

  let idleTimer = null;
  let assistantRoot = null;
  let robot = null;
  let chatWindow = null;
  let greeting = null;
  let messages = null;
  let chatInput = null;
  let chatForm = null;

  let isChatOpen = false;
  let isLoading = false;

  /* =========================================
     LOAD CSS
  ========================================= */

  function loadAssistantCSS() {
    const existingCSS = document.querySelector(
      'link[data-tcn-ai-css="true"]'
    );

    if (existingCSS) return;

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = CSS_URL.href;
    link.dataset.tcnAiCss = "true";

    document.head.appendChild(link);
  }

  /* =========================================
     LOAD ASSISTANT HTML
  ========================================= */

  async function loadAssistantHTML() {
    if (document.getElementById("tcn-ai-assistant")) {
      initializeAssistant();
      return;
    }

    try {
      const response = await fetch(HTML_URL.href, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error("Assistant HTML could not be loaded.");
      }

      const html = await response.text();

      const temporaryContainer = document.createElement("div");
      temporaryContainer.innerHTML = html;

      const assistantElement = temporaryContainer.querySelector(
        "#tcn-ai-assistant"
      );

      if (!assistantElement) {
        throw new Error("TCN AI assistant root was not found.");
      }

      document.body.appendChild(assistantElement);

      initializeAssistant();

    } catch (error) {
      console.error("TCN AI loading error:", error);
    }
  }

  /* =========================================
     SET IMAGE PATHS
  ========================================= */

  function loadCharacterImages() {
    const imageElements = assistantRoot.querySelectorAll(
      "[data-tcn-image]"
    );

    imageElements.forEach(function (image) {
      const imagePath = image.dataset.tcnImage;

      if (!imagePath) return;

      image.src = new URL(imagePath, assistantBase).href;

      image.addEventListener("error", function () {
        console.warn(
          "TCN AI image not found:",
          image.src
        );
      });
    });
  }

  /* =========================================
     INITIALIZE ELEMENTS
  ========================================= */

  function initializeAssistant() {
    assistantRoot = document.getElementById(
      "tcn-ai-assistant"
    );

    if (!assistantRoot || assistantRoot.dataset.initialized === "true") {
      return;
    }

    assistantRoot.dataset.initialized = "true";

    robot = assistantRoot.querySelector("#tcnAiRobot");
    chatWindow = assistantRoot.querySelector("#tcnAiWindow");
    greeting = assistantRoot.querySelector("#tcnAiGreeting");
    messages = assistantRoot.querySelector("#tcnAiMessages");
    chatInput = assistantRoot.querySelector("#tcnAiInput");
    chatForm = assistantRoot.querySelector("#tcnAiForm");

    if (
      !robot ||
      !chatWindow ||
      !messages ||
      !chatInput ||
      !chatForm
    ) {
      console.error("TCN AI: Required elements are missing.");
      return;
    }

    loadCharacterImages();
    setupCharacter();
    setupActivityDetection();
    setupChat();
    setupSuggestions();

    setStanding();

    resetIdleTimer();

    console.log("TCN AI Assistant initialized.");
  }

  /* =========================================
     CHARACTER STATES
  ========================================= */

  function setStanding() {
    if (!robot) return;

    robot.classList.remove("is-sitting");
    robot.classList.add("is-standing");
  }

  function setSitting() {
    if (!robot || isChatOpen) return;

    robot.classList.remove("is-standing");
    robot.classList.add("is-sitting");
  }

  function resetIdleTimer() {
    if (!robot) return;

    setStanding();

    clearTimeout(idleTimer);

    idleTimer = setTimeout(function () {
      if (!isChatOpen) {
        setSitting();
      }
    }, IDLE_TIME);
  }

  /* =========================================
     HAPPY CLICK REACTION
  ========================================= */

  function happyReaction() {
    if (!robot) return;

    robot.classList.remove("is-happy");

    void robot.offsetWidth;

    robot.classList.add("is-happy");

    setTimeout(function () {
      robot.classList.remove("is-happy");
    }, 700);
  }

  /* =========================================
     CHARACTER CLICK
  ========================================= */

  function setupCharacter() {
    robot.addEventListener("click", function () {
      happyReaction();
      openChat();
    });
  }

  /* =========================================
     ACTIVITY DETECTION
  ========================================= */

  function setupActivityDetection() {
    const activityEvents = [
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "wheel"
    ];

    activityEvents.forEach(function (eventName) {
      window.addEventListener(
        eventName,
        function () {
          if (!isChatOpen) {
            resetIdleTimer();
          }
        },
        {
          passive: true
        }
      );
    });
  }

  /* =========================================
     OPEN CHAT
  ========================================= */

  function openChat() {
    if (!chatWindow) return;

    isChatOpen = true;

    clearTimeout(idleTimer);

    setStanding();

    chatWindow.classList.add("is-open");
    chatWindow.setAttribute("aria-hidden", "false");

    robot.setAttribute("aria-expanded", "true");

    if (greeting) {
      greeting.classList.add("is-hidden");
    }

    happyReaction();

    setTimeout(function () {
      chatInput.focus();
    }, 250);
  }

  /* =========================================
     CLOSE CHAT
  ========================================= */

  function closeChat() {
    if (!chatWindow) return;

    isChatOpen = false;

    chatWindow.classList.remove("is-open");
    chatWindow.setAttribute("aria-hidden", "true");

    robot.setAttribute("aria-expanded", "false");

    resetIdleTimer();
  }

  /* =========================================
     CHAT EVENTS
  ========================================= */

  function setupChat() {
    const closeButton = assistantRoot.querySelector(
      "#tcnAiClose"
    );

    if (closeButton) {
      closeButton.addEventListener("click", closeChat);
    }

    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const question = chatInput.value.trim();

      if (!question || isLoading) return;

      chatInput.value = "";

      sendMessage(question);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isChatOpen) {
        closeChat();
      }
    });
  }

  /* =========================================
     DISPLAY MESSAGES
  ========================================= */

  function addMessage(text, sender) {
    const message = document.createElement("div");

    message.className =
      "tcn-ai-message " + sender;

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
  }

  /* =========================================
     TCN KNOWLEDGE RESPONSES
     Offline starter knowledge
  ========================================= */

  function getTCNResponse(question) {
    const q = question.toLowerCase();

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey") ||
      q.includes("नमस्ते") ||
      q.includes("हेलो")
    ) {
      return "Hello! 👋 Welcome to Total Crypto Hub. मैं TCN और हमारे Web3 ecosystem के बारे में आपकी मदद कर सकती हूँ। 😊";
    }

    if (
      q.includes("what is tcn") ||
      q.includes("total crypto network") ||
      q.includes("टीसीएन")
    ) {
      return "TCN का पूरा नाम Total Crypto Network है। यह हमारा Web3 ecosystem और community-focused network है।";
    }

    if (
      q.includes("total crypto hub") ||
      q.includes("crypto hub") ||
      q.includes("हब")
    ) {
      return "Total Crypto Hub हमारा platform है जहाँ आप DePIN Projects, Community Projects, Airdrops, Wallets, Exchanges और Web3 Tools से जुड़ी जानकारी देख सकते हैं।";
    }

    if (
      q.includes("depin") ||
      q.includes("de-pin")
    ) {
      return "Total Crypto Hub के DePIN section में आप Decentralized Physical Infrastructure Network से जुड़े projects की जानकारी explore कर सकते हैं।";
    }

    if (
      q.includes("airdrop") ||
      q.includes("airdrops")
    ) {
      return "आप Total Crypto Hub के Airdrops & Campaigns section में उपलब्ध campaigns और airdrop-related जानकारी देख सकते हैं।";
    }

    if (
      q.includes("wallet") ||
      q.includes("exchange")
    ) {
      return "हमारे Wallets & Exchanges section में crypto wallets और exchanges से जुड़ी जानकारी उपलब्ध है।";
    }

    if (
      q.includes("token checker") ||
      q.includes("token")
    ) {
      return "Token Checker हमारे Web3 Tools का हिस्सा है। इसका उपयोग token से जुड़ी उपलब्ध जानकारी देखने के लिए किया जा सकता है।";
    }

    if (
      q.includes("earning calculator") ||
      q.includes("calculator") ||
      q.includes("earning")
    ) {
      return "Earning Calculator Total Crypto Hub का एक Web3 tool है, जिसकी मदद से आप earning estimates calculate कर सकते हैं।";
    }

    if (
      q.includes("community") ||
      q.includes("join")
    ) {
      return "Total Crypto Hub में Community Projects और community-related जानकारी explore कर सकते हैं। हमारी community से जुड़ने के लिए वेबसाइट के Community section को देखें।";
    }

    if (
      q.includes("service") ||
      q.includes("feature") ||
      q.includes("website")
    ) {
      return "Total Crypto Hub में DePIN Projects, Community Projects, Airdrops & Campaigns, Wallets & Exchanges, Token Checker और Earning Calculator जैसे sections हैं।";
    }

    if (
      q.includes("thank") ||
      q.includes("धन्यवाद")
    ) {
      return "You're most welcome! ❤️ Total Crypto Hub पर आपका स्वागत है।";
    }

    return "मैं आपकी TCN AI Assistant हूँ। 😊 मैं केवल Total Crypto Hub, Total Crypto Network, हमारे projects, services और website features से जुड़े सवालों में मदद कर सकती हूँ। कृपया अपना सवाल थोड़ा स्पष्ट पूछें।";
  }

  /* =========================================
     SEND MESSAGE
  ========================================= */

  function sendMessage(question) {
    if (isLoading) return;

    isLoading = true;

    addMessage(question, "user");

    const reply = getTCNResponse(question);

    setTimeout(function () {
      addMessage(reply, "bot");

      isLoading = false;

      chatInput.focus();
    }, 450);
  }

  /* =========================================
     QUICK SUGGESTIONS
  ========================================= */

  function setupSuggestions() {
    const suggestionButtons = assistantRoot.querySelectorAll(
      "[data-question]"
    );

    suggestionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const question = button.dataset.question;

        if (question && !isLoading) {
          sendMessage(question);
        }
      });
    });
  }

  /* =========================================
     START ASSISTANT
  ========================================= */

  function startAssistant() {
    loadAssistantCSS();

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        loadAssistantHTML,
        { once: true }
      );
    } else {
      loadAssistantHTML();
    }
  }

  startAssistant();

})();


/* ==========================================
   TOTAL CRYPTO HUB - AI GIRL ASSISTANT
   Drag, Move, Stand, Sit and TCN Chat
========================================== */

(() => {
  "use strict";

  const currentScript = document.currentScript;
  const scriptURL = currentScript
    ? currentScript.src
    : window.location.href;

  const assistantBase = new URL(".", scriptURL);

  let idleTimer = null;
  let isDragging = false;
  let dragStarted = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let elementStartX = 0;
  let elementStartY = 0;
  let activePointerId = null;

  function loadCSS() {
    const cssURL = new URL("assistant.css", assistantBase).href;

    const alreadyLoaded = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some(link => link.href === cssURL);

    if (!alreadyLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssURL;
      document.head.appendChild(link);
    }
  }

  async function loadAssistantHTML() {
    if (document.getElementById("tcn-ai-assistant")) {
      initializeAssistant();
      return;
    }

    try {
      const response = await fetch(
        new URL("assistant.html", assistantBase).href
      );

      if (!response.ok) {
        throw new Error("Assistant HTML could not be loaded.");
      }

      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      const assistant = wrapper.querySelector("#tcn-ai-assistant");

      if (!assistant) {
        throw new Error("Assistant root element is missing.");
      }

      document.body.appendChild(assistant);
      initializeAssistant();

    } catch (error) {
      console.error("TCN Assistant:", error);
    }
  }

  function initializeAssistant() {
    const root = document.getElementById("tcn-ai-assistant");

    if (!root || root.dataset.initialized === "true") {
      return;
    }

    const characterArea = root.querySelector(".tcn-ai-character-area");
    const robot = root.querySelector("#tcnAiRobot");
    const chatWindow = root.querySelector("#tcnAiWindow");
    const closeButton = root.querySelector("#tcnAiClose");
    const form = root.querySelector("#tcnAiForm");
    const input = root.querySelector("#tcnAiInput");
    const messages = root.querySelector("#tcnAiMessages");

    if (
      !characterArea ||
      !robot ||
      !chatWindow ||
      !closeButton ||
      !form ||
      !input ||
      !messages
    ) {
      console.error("TCN Assistant: Required HTML elements are missing.");
      return;
    }

    root.dataset.initialized = "true";

    /* Load image paths */

    root.querySelectorAll("[data-tcn-image]").forEach(image => {
      image.src = new URL(
        image.dataset.tcnImage,
        assistantBase
      ).href;

      image.onerror = () => {
        console.error("TCN Assistant image not found:", image.src);
      };
    });

    /* Stand and sit */

    function standUp() {
      robot.classList.remove("is-sitting");
      robot.classList.add("is-standing");
    }

    function sitDown() {
      if (!chatWindow.classList.contains("is-open")) {
        robot.classList.remove("is-standing");
        robot.classList.add("is-sitting");
      }
    }

    function resetIdleTimer() {
      standUp();

      clearTimeout(idleTimer);

      idleTimer = setTimeout(() => {
        sitDown();
      }, 5000);
    }

    /* Chat open and close */

    function openChat() {
      chatWindow.classList.add("is-open");
      chatWindow.setAttribute("aria-hidden", "false");
      robot.setAttribute("aria-expanded", "true");

      standUp();
      clearTimeout(idleTimer);

      input.focus();
    }

    function closeChat() {
      chatWindow.classList.remove("is-open");
      chatWindow.setAttribute("aria-hidden", "true");
      robot.setAttribute("aria-expanded", "false");

      resetIdleTimer();
    }

    robot.addEventListener("click", event => {
      if (dragStarted) {
        event.preventDefault();
        event.stopPropagation();
        dragStarted = false;
        return;
      }

      if (chatWindow.classList.contains("is-open")) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeButton.addEventListener("click", closeChat);

    /* Drag and move character */

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    robot.addEventListener("pointerdown", event => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }

      activePointerId = event.pointerId;
      isDragging = true;
      dragStarted = false;

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;

      const rect = characterArea.getBoundingClientRect();

      elementStartX = rect.left;
      elementStartY = rect.top;

      robot.setPointerCapture(event.pointerId);
      resetIdleTimer();
    });

    robot.addEventListener("pointermove", event => {
      if (!isDragging || event.pointerId !== activePointerId) {
        return;
      }

      const moveX = event.clientX - pointerStartX;
      const moveY = event.clientY - pointerStartY;

      if (
        Math.abs(moveX) > 5 ||
        Math.abs(moveY) > 5
      ) {
        dragStarted = true;
      }

      if (!dragStarted) {
        return;
      }

      const maxX = window.innerWidth - characterArea.offsetWidth;
      const maxY = window.innerHeight - characterArea.offsetHeight;

      const newX = clamp(
        elementStartX + moveX,
        0,
        Math.max(0, maxX)
      );

      const newY = clamp(
        elementStartY + moveY,
        0,
        Math.max(0, maxY)
      );

      characterArea.style.left = newX + "px";
      characterArea.style.top = newY + "px";
      characterArea.style.right = "auto";
      characterArea.style.bottom = "auto";

      resetIdleTimer();
    });

    function stopDragging(event) {
      if (!isDragging || event.pointerId !== activePointerId) {
        return;
      }

      isDragging = false;
      activePointerId = null;

      if (dragStarted) {
        setTimeout(() => {
          dragStarted = false;
        }, 100);
      }
    }

    robot.addEventListener("pointerup", stopDragging);
    robot.addEventListener("pointercancel", stopDragging);

    /* Keep character inside screen after resize */

    window.addEventListener("resize", () => {
      if (!characterArea.style.left) {
        return;
      }

      const rect = characterArea.getBoundingClientRect();

      const newX = clamp(
        rect.left,
        0,
        Math.max(0, window.innerWidth - characterArea.offsetWidth)
      );

      const newY = clamp(
        rect.top,
        0,
        Math.max(0, window.innerHeight - characterArea.offsetHeight)
      );

      characterArea.style.left = newX + "px";
      characterArea.style.top = newY + "px";
    });

    /* Activity detection */

    [
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "wheel"
    ].forEach(eventName => {
      document.addEventListener(eventName, resetIdleTimer, {
        passive: true
      });
    });

    /* TCN-only assistant knowledge */

    function getTCNReply(question) {
      const q = question.toLowerCase();

      if (
        q.includes("price") ||
        q.includes("token price") ||
        q.includes("coin price")
      ) {
        return "मैं TCN Hub की AI Assistant हूँ। किसी token की current price जानने के लिए वेबसाइट के संबंधित project या token page को देखें।";
      }

      if (
        q.includes("what is tcn") ||
        q.includes("total crypto network")
      ) {
        return "TCN का अर्थ Total Crypto Network है। Total Crypto Hub इस ecosystem से जुड़े crypto, Web3 और community resources को एक जगह व्यवस्थित करने के लिए बनाया गया है।";
      }

      if (
        q.includes("total crypto hub") ||
        q.includes("about tcn") ||
        q.includes("hub")
      ) {
        return "Total Crypto Hub एक Web3 resource platform है। यहाँ DePIN Projects, Community Projects, Airdrops, Wallets, Token Checker और Earning Calculator जैसे sections उपलब्ध हैं।";
      }

      if (q.includes("depin")) {
        return "DePIN का मतलब Decentralized Physical Infrastructure Networks है। Total Crypto Hub के DePIN Projects section में संबंधित projects और उनकी जानकारी देख सकते हैं।";
      }

      if (q.includes("airdrop")) {
        return "Airdrops & Campaigns section में crypto airdrop campaigns और participation से जुड़ी जानकारी देख सकते हैं। किसी भी campaign में शामिल होने से पहले उसकी official website और conditions जरूर जाँचें।";
      }

      if (q.includes("community")) {
        return "TCN Community section में community projects और resources खोज सकते हैं। Community से जुड़ने के लिए वेबसाइट का Community विकल्प देखें।";
      }

      if (
        q.includes("service") ||
        q.includes("tools") ||
        q.includes("wallet") ||
        q.includes("calculator") ||
        q.includes("token checker")
      ) {
        return "Total Crypto Hub में DePIN Projects, Community Projects, Airdrops & Campaigns, Wallets & Exchanges, Token Checker और Earning Calculator जैसे sections हैं। आप वेबसाइट के menu से इन्हें खोल सकते हैं।";
      }

      if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
      ) {
        return "Hello! 😊 मैं TCN AI Assistant हूँ। Total Crypto Hub, DePIN, Airdrops, Community और वेबसाइट के tools के बारे में पूछ सकते हैं।";
      }

      return "मैं केवल Total Crypto Hub और Total Crypto Network से संबंधित सवालों में मदद कर सकती हूँ। आप DePIN, Airdrops, Community, Wallets, Token Checker या Earning Calculator के बारे में पूछ सकते हैं।";
    }

    function addMessage(text, sender) {
      const message = document.createElement("div");

      message.className = "tcn-ai-message " + sender;
      message.textContent = text;

      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function sendQuestion(question) {
      const cleanQuestion = question.trim();

      if (!cleanQuestion) {
        return;
      }

      addMessage(cleanQuestion, "user");
      input.value = "";

      const reply = getTCNReply(cleanQuestion);

      setTimeout(() => {
        addMessage(reply, "assistant");
      }, 350);
    }

    form.addEventListener("submit", event => {
      event.preventDefault();
      sendQuestion(input.value);
    });

    /* Suggestion buttons */

    root.querySelectorAll("[data-question]").forEach(button => {
      button.addEventListener("click", () => {
        sendQuestion(button.dataset.question);
      });
    });

    /* Escape key closes chat */

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        chatWindow.classList.contains("is-open")
      ) {
        closeChat();
      }
    });

    resetIdleTimer();
  }

  loadCSS();
  loadAssistantHTML();

})();

(() => {
  "use strict";

  const currentScript = document.currentScript;
  const scriptURL = currentScript ? currentScript.src : window.location.href;
  const assistantBase = new URL(".", scriptURL);

  let isDragging = false;
  let dragStarted = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let elementStartX = 0;
  let elementStartY = 0;
  let activePointerId = null;

  function loadCSS() {
    const cssURL = new URL("assistant.css", assistantBase).href;
    if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(l => l.href === cssURL)) {
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
      const response = await fetch(new URL("assistant.html", assistantBase).href);
      if (!response.ok) return;
      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const assistant = wrapper.querySelector("#tcn-ai-assistant");
      if (assistant) {
        document.body.appendChild(assistant);
        initializeAssistant();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function initializeAssistant() {
    const root = document.getElementById("tcn-ai-assistant");
    if (!root || root.dataset.initialized === "true") return;

    const characterArea = root.querySelector(".tcn-ai-character-area");
    const robot = root.querySelector("#tcnAiRobot");
    const chatWindow = root.querySelector("#tcnAiWindow");
    const closeButton = root.querySelector("#tcnAiClose");
    const form = root.querySelector("#tcnAiForm");
    const input = root.querySelector("#tcnAiInput");
    const messages = root.querySelector("#tcnAiMessages");

    if (!characterArea || !robot || !chatWindow) return;
    root.dataset.initialized = "true";

    root.querySelectorAll("[data-tcn-image]").forEach(img => {
      img.src = new URL(img.dataset.tcnImage, assistantBase).href;
    });

    robot.addEventListener("click", (e) => {
      if (dragStarted) {
        e.preventDefault();
        dragStarted = false;
        return;
      }
      chatWindow.classList.toggle("is-open");
      if (chatWindow.classList.contains("is-open")) input.focus();
    });

    closeButton.addEventListener("click", () => {
      chatWindow.classList.remove("is-open");
    });

    robot.addEventListener("pointerdown", (e) => {
      activePointerId = e.pointerId;
      isDragging = true;
      dragStarted = false;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      const rect = characterArea.getBoundingClientRect();
      elementStartX = rect.left;
      elementStartY = rect.top;
      robot.setPointerCapture(e.pointerId);
    });

    robot.addEventListener("pointermove", (e) => {
      if (!isDragging || e.pointerId !== activePointerId) return;
      const moveX = e.clientX - pointerStartX;
      const moveY = e.clientY - pointerStartY;
      if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) dragStarted = true;
      if (!dragStarted) return;

      characterArea.style.left = (elementStartX + moveX) + "px";
      characterArea.style.top = (elementStartY + moveY) + "px";
      characterArea.style.right = "auto";
      characterArea.style.bottom = "auto";
    });

    const stopDrag = (e) => {
      if (!isDragging || e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      setTimeout(() => { dragStarted = false; }, 100);
    };

    robot.addEventListener("pointerup", stopDrag);
    robot.addEventListener("pointercancel", stopDrag);

    function addMessage(text, sender) {
      const msg = document.createElement("div");
      msg.className = "tcn-ai-message " + sender;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;
      addMessage(txt, "user");
      input.value = "";
      setTimeout(() => {
        addMessage("मैं Total Crypto Hub सहायक हूँ। आप DePIN, Airdrops और Wallets के बारे में पूछ सकते हैं।", "assistant");
      }, 350);
    });

    root.querySelectorAll("[data-question]").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.dataset.question;
        addMessage(q, "user");
        setTimeout(() => {
          addMessage("Total Crypto Hub पर आपका स्वागत है! अधिक जानकारी के लिए संबंधित पेज देखें।", "assistant");
        }, 350);
      });
    });
  }

  loadCSS();
  loadAssistantHTML();
})();

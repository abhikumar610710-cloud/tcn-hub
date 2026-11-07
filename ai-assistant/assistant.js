
/* =========================================
   TOTAL CRYPTO HUB - TCN AI ASSISTANT
   Compact mascot, idle animation and chat
========================================= */

(function () {
  "use strict";

  const currentScript = document.currentScript;
  const scriptURL = currentScript
    ? currentScript.src
    : window.location.href;

  const assistantBase = new URL(".", scriptURL);
  const htmlURL = new URL("assistant.html", assistantBase).href;
  const cssURL = new URL("assistant.css", assistantBase).href;

  let idleTimer;
  let assistantReady = false;

  function loadCSS() {
    if (document.querySelector('[data-tcn-assistant-css]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;
    link.dataset.tcnAssistantCss = "true";
    document.head.appendChild(link);
  }

  function loadImages(root) {
    root.querySelectorAll("[data-tcn-image]").forEach((img) => {
      const imagePath = img.getAttribute("data-tcn-image");
      img.src = new URL(imagePath, assistantBase).href;
    });
  }

  function addMessage(container, message, sender) {
    const bubble = document.createElement("div");

    bubble.style.cssText = `
      max-width: 88%;
      width: fit-content;
      padding: 9px 12px;
      margin: 7px 0;
      border-radius: 12px;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      ${sender === "user"
        ? "margin-left:auto;background:#d9ffe7;color:#064b29;"
        : "margin-right:auto;background:#e9f2ec;color:#17251f;"}
    `;

    bubble.textContent = message;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  function findSiteLink(words) {
    const links = Array.from(
      document.querySelectorAll("a[href]")
    );

    return links.find((link) => {
      const text = (
        link.innerText + " " +
        link.getAttribute("href")
      ).toLowerCase();

      return words.some((word) => text.includes(word));
    });
  }

  function answerTCN(question) {
    const q = question.toLowerCase();

    const topics = [
      {
        words: ["depin"],
        response: "DePIN यानी Decentralized Physical Infrastructure Networks. TCN वेबसाइट पर DePIN से जुड़ा सेक्शन देखने के लिए नीचे लिंक देखें।",
        search: ["depin"]
      },
      {
        words: ["airdrop", "air drop", "एयरड्रॉप"],
        response: "TCN में Airdrops से जुड़ी जानकारी और अपडेट देखने के लिए वेबसाइट का संबंधित सेक्शन खोलें।",
        search: ["airdrop"]
      },
      {
        words: ["wallet", "wallets", "वॉलेट"],
        response: "TCN के Wallets सेक्शन में उपलब्ध जानकारी देखने के लिए नीचे लिंक देखें।",
        search: ["wallet"]
      },
      {
        words: ["earning calculator", "calculator", "earning", "कमाई"],
        response: "TCN Earning Calculator से जुड़ा पेज देखने के लिए नीचे लिंक देखें।",
        search: ["calculator", "earning"]
      },
      {
        words: ["community", "telegram", "discord", "समुदाय"],
        response: "TCN Community से जुड़ने के लिए वेबसाइट पर उपलब्ध Community लिंक देखें।",
        search: ["community", "telegram", "discord"]
      },
      {
        words: ["token checker", "token check", "token"],
        response: "TCN Token Checker से जुड़ी जानकारी देखने के लिए नीचे लिंक देखें।",
        search: ["token-checker", "token checker"]
      },
      {
        words: ["service", "services", "सेवा"],
        response: "Total Crypto Hub की सेवाओं की जानकारी के लिए वेबसाइट का Services सेक्शन देखें।",
        search: ["service"]
      },
      {
        words: ["about", "total crypto hub", "what is tcn", "tcn kya", "टीसीएन"],
        response: "TCN यानी Total Crypto Network और Total Crypto Hub से जुड़ी जानकारी के लिए वेबसाइट के About सेक्शन को देखें।",
        search: ["about"]
      }
    ];

    const matched = topics.find((topic) =>
      topic.words.some((word) => q.includes(word))
    );

    if (!matched) {
      return {
        message:
          "मैं केवल TCN और Total Crypto Hub से जुड़े सवालों में मदद कर सकती हूँ। आप DePIN, Airdrops, Wallets, Community या TCN Services के बारे में पूछ सकते हैं।",
        link: null
      };
    }

    const link = findSiteLink(matched.search);

    return {
      message: matched.response,
      link: link || null
    };
  }

  function sendQuestion(question, root) {
    const messages = root.querySelector("#tcnAiMessages");
    const input = root.querySelector("#tcnAiInput");

    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    addMessage(messages, cleanQuestion, "user");

    const result = answerTCN(cleanQuestion);

    addMessage(messages, result.message, "assistant");

    if (result.link) {
      const linkButton = document.createElement("a");
      linkButton.href = result.link.href;
      linkButton.textContent = "Open TCN Section →";
      linkButton.style.cssText = `
        display:inline-block;
        margin:5px 0 10px;
        padding:8px 12px;
        border-radius:18px;
        background:#078d43;
        color:white;
        text-decoration:none;
        font-size:12px;
      `;

      messages.appendChild(linkButton);
    }

    messages.scrollTop = messages.scrollHeight;

    if (input) input.value = "";
  }

  function setStanding(root) {
    const robot = root.querySelector("#tcnAiRobot");
    if (!robot) return;

    robot.classList.remove("is-sitting");
    robot.classList.add("is-standing");
  }

  function setSitting(root) {
    const robot = root.querySelector("#tcnAiRobot");
    const windowPanel = root.querySelector("#tcnAiWindow");

    if (!robot || (windowPanel && windowPanel.classList.contains("is-open"))) {
      return;
    }

    robot.classList.remove("is-standing");
    robot.classList.add("is-sitting");
  }

  function resetIdleTimer(root) {
    setStanding(root);
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      setSitting(root);
    }, 5000);
  }

  function initializeAssistant(root) {
    if (assistantReady || root.dataset.initialized === "true") return;

    const robot = root.querySelector("#tcnAiRobot");
    const panel = root.querySelector("#tcnAiWindow");
    const closeButton = root.querySelector("#tcnAiClose");
    const form = root.querySelector("#tcnAiForm");
    const input = root.querySelector("#tcnAiInput");

    if (!robot || !panel || !closeButton || !form || !input) {
      console.error("TCN AI Assistant: Required elements missing.");
      return;
    }

    assistantReady = true;
    root.dataset.initialized = "true";

    loadImages(root);

    function openChat() {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      robot.setAttribute("aria-expanded", "true");
      setStanding(root);
      clearTimeout(idleTimer);

      input.focus();
    }

    function closeChat() {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      robot.setAttribute("aria-expanded", "false");

      resetIdleTimer(root);
    }

    robot.addEventListener("click", openChat);
    closeButton.addEventListener("click", closeChat);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendQuestion(input.value, root);
    });

    root.querySelectorAll("[data-question]").forEach((button) => {
      button.addEventListener("click", function () {
        sendQuestion(button.dataset.question, root);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        closeChat();
      }
    });

    const activityEvents = [
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "wheel"
    ];

    activityEvents.forEach((eventName) => {
      document.addEventListener(
        eventName,
        () => resetIdleTimer(root),
        { passive: true }
      );
    });

    resetIdleTimer(root);
  }

  function startAssistant() {
    loadCSS();

    const existingRoot = document.querySelector("#tcn-ai-assistant");

    if (existingRoot) {
      initializeAssistant(existingRoot);
      return;
    }

    fetch(htmlURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load assistant.html");
        }
        return response.text();
      })
      .then((html) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        const root = wrapper.querySelector("#tcn-ai-assistant");

        if (!root) {
          throw new Error("Assistant root not found.");
        }

        document.body.appendChild(root);
        initializeAssistant(root);
      })
      .catch((error) => {
        console.error("TCN AI Assistant error:", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAssistant);
  } else {
    startAssistant();
  }
})();

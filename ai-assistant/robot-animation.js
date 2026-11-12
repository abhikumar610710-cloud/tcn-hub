/* =========================================
   TOTAL CRYPTO HUB
   TCN AI ROBOT - CHARACTER ANIMATIONS
========================================= */

(function () {
  "use strict";

  let observer = null;

  function addAnimationStyles() {
    if (document.getElementById("tcn-ai-animation-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "tcn-ai-animation-styles";

    style.textContent = `
      /* Floating Robot: gentle natural hovering movement */
      #tcn-ai-assistant
      .tcn-ai-character
      .tcn-ai-robot-head {
        animation: tcnRobotFloat 3.2s ease-in-out infinite;
        transform-origin: center center;
      }

      /* Happy reaction when clicked */
      #tcn-ai-assistant
      .tcn-ai-character.is-happy
      .tcn-ai-robot-head {
        animation: tcnRobotHappy 0.65s ease-in-out;
      }

      @keyframes tcnRobotFloat {
        0%, 100% {
          transform: translateX(-50%) translateY(0) rotate(0deg);
        }

        50% {
          transform: translateX(-50%) translateY(-5px) rotate(1.5deg);
        }
      }

      @keyframes tcnRobotHappy {
        0% {
          transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
        }

        35% {
          transform: translateX(-50%) translateY(-8px) scale(1.08) rotate(-3deg);
        }

        70% {
          transform: translateX(-50%) translateY(-4px) scale(1.05) rotate(3deg);
        }

        100% {
          transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #tcn-ai-assistant .tcn-ai-robot-head {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function initializeCharacter() {
    const assistant = document.getElementById("tcn-ai-assistant");

    if (!assistant) {
      return false;
    }

    if (assistant.dataset.animationInitialized === "true") {
      return true;
    }

    const character = assistant.querySelector("#tcnAiRobot");

    if (!character) {
      return false;
    }

    addAnimationStyles();

    assistant.dataset.animationInitialized = "true";
    character.classList.add("tcn-ai-animation-ready");

    return true;
  }

  function watchForAssistant() {
    if (initializeCharacter()) {
      return;
    }

    if (observer) {
      return;
    }

    observer = new MutationObserver(function () {
      if (initializeCharacter()) {
        observer.disconnect();
        observer = null;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function start() {
    watchForAssistant();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }

})();

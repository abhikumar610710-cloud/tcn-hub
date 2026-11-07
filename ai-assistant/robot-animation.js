
/* =========================================
   TOTAL CRYPTO HUB
   TCN AI GIRL - CHARACTER ANIMATIONS
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
      /* Standing: gentle natural movement */
      #tcn-ai-assistant
      .tcn-ai-character.is-standing
      .tcn-ai-girl-standing {
        animation: tcnGirlStanding 2.8s ease-in-out infinite;
        transform-origin: center bottom;
      }

      /* Sitting: soft breathing movement */
      #tcn-ai-assistant
      .tcn-ai-character.is-sitting
      .tcn-ai-girl-sitting {
        animation: tcnGirlSitting 3.5s ease-in-out infinite;
        transform-origin: center bottom;
      }

      /* Happy reaction when clicked */
      #tcn-ai-assistant
      .tcn-ai-character.is-happy
      .tcn-ai-girl {
        animation: tcnGirlHappy 0.65s ease-in-out;
      }

      @keyframes tcnGirlStanding {
        0%, 100% {
          transform: translateX(-50%) translateY(0) rotate(0deg);
        }

        50% {
          transform: translateX(-50%) translateY(-3px) rotate(1deg);
        }
      }

      @keyframes tcnGirlSitting {
        0%, 100% {
          transform: translateX(-50%) translateY(0) scale(1);
        }

        50% {
          transform: translateX(-50%) translateY(-2px) scale(1.01);
        }
      }

      @keyframes tcnGirlHappy {
        0% {
          transform: translateX(-50%) translateY(0) scale(1);
        }

        35% {
          transform: translateX(-50%) translateY(-5px) scale(1.05) rotate(-2deg);
        }

        70% {
          transform: translateX(-50%) translateY(-3px) scale(1.04) rotate(2deg);
        }

        100% {
          transform: translateX(-50%) translateY(0) scale(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #tcn-ai-assistant .tcn-ai-girl {
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

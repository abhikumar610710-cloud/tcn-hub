
/* =========================================
   TOTAL CRYPTO HUB
   EXPRESSIVE 3D ROBOT ANIMATIONS
========================================= */

(() => {
  "use strict";

  const robotSelector = "#tcnAiRobot";
  let robot = null;
  let animationStarted = false;
  let idleTimer = null;
  let reactionTimer = null;
  let eyeElements = [];
  let originalEyePositions = [];

  function findRobot() {
    robot = document.querySelector(robotSelector);

    if (!robot) return false;

    eyeElements = Array.from(
      robot.querySelectorAll(".tcn-robot-eye")
    );

    if (!eyeElements.length) return false;

    originalEyePositions = eyeElements.map((eye) => ({
      cx: Number(eye.getAttribute("cx")) || 0,
      cy: Number(eye.getAttribute("cy")) || 0
    }));

    return true;
  }

  function setReaction(type, duration = 1100) {
    if (!robot) return;

    robot.dataset.reaction = type;

    clearTimeout(reactionTimer);

    reactionTimer = setTimeout(() => {
      if (robot) {
        robot.dataset.reaction = "normal";
      }
    }, duration);
  }

  function resetEyes() {
    if (!robot || !eyeElements.length) return;

    eyeElements.forEach((eye, index) => {
      const original = originalEyePositions[index];

      eye.setAttribute("cx", original.cx);
      eye.setAttribute("cy", original.cy);
    });
  }

  function moveEyes(pointerX, pointerY) {
    if (!robot || !eyeElements.length) return;

    const rect = robot.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const directionX = Math.max(
      -1,
      Math.min(1, (pointerX - centerX) / 180)
    );

    const directionY = Math.max(
      -1,
      Math.min(1, (pointerY - centerY) / 180)
    );

    eyeElements.forEach((eye, index) => {
      const original = originalEyePositions[index];

      eye.setAttribute(
        "cx",
        original.cx + directionX * 2.5
      );

      eye.setAttribute(
        "cy",
        original.cy + directionY * 1.5
      );
    });
  }

  function startIdleExpressions() {
    clearInterval(idleTimer);

    const expressions = [
      "happy",
      "normal",
      "happy",
      "normal"
    ];

    let index = 0;

    idleTimer = setInterval(() => {
      if (!robot) return;

      const chat = document.getElementById("tcnAiWindow");

      if (chat && chat.classList.contains("active")) {
        return;
      }

      setReaction(expressions[index], 1300);

      index = (index + 1) % expressions.length;
    }, 4500);
  }

  function handleRobotClick() {
    if (!robot) return;

    setReaction("happy", 1400);

    robot.classList.remove("tcn-robot-clicked");

    void robot.offsetWidth;

    robot.classList.add("tcn-robot-clicked");

    setTimeout(() => {
      if (robot) {
        robot.classList.remove("tcn-robot-clicked");
      }
    }, 900);
  }

  function handleChatState() {
    const chat = document.getElementById("tcnAiWindow");

    if (!chat) return;

    const observer = new MutationObserver(() => {
      if (chat.classList.contains("active")) {
        setReaction("happy", 1600);
      } else {
        setReaction("normal", 700);
      }
    });

    observer.observe(chat, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function addAnimationStyles() {
    if (document.getElementById("tcnRobotAnimationStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "tcnRobotAnimationStyles";

    style.textContent = `
      #tcnAiRobot {
        transform-origin: center bottom;
        transition: transform 0.25s ease;
      }

      #tcnAiRobot[data-reaction="happy"] {
        filter: brightness(1.08);
      }

      #tcnAiRobot[data-reaction="thinking"] {
        filter: brightness(0.95);
      }

      #tcnAiRobot[data-reaction="normal"] {
        filter: none;
      }

      #tcnAiRobot.tcn-robot-clicked {
        animation: tcnRobotClickBounce 0.75s ease;
      }

      #tcnAiRobot.tcn-robot-clicked .tcn-robot-arm {
        animation: tcnRobotWave 0.55s ease-in-out 2;
        transform-box: fill-box;
        transform-origin: center;
      }

      #tcnAiRobot[data-reaction="happy"] .tcn-robot-smile {
        transform-box: fill-box;
        transform-origin: center;
        transform: scale(1.15);
      }

      #tcnAiRobot[data-reaction="thinking"] .tcn-robot-eye {
        opacity: 0.8;
      }

      @keyframes tcnRobotClickBounce {
        0%, 100% {
          transform: translateY(0) scale(1);
        }
        35% {
          transform: translateY(-13px) scale(1.05);
        }
        65% {
          transform: translateY(0) scale(0.97);
        }
      }

      @keyframes tcnRobotWave {
        0%, 100% {
          rotate: 0deg;
        }
        25% {
          rotate: -22deg;
        }
        50% {
          rotate: 16deg;
        }
        75% {
          rotate: -15deg;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #tcnAiRobot,
        #tcnAiRobot * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function initializeRobotAnimations() {
    if (animationStarted) return;

    if (!findRobot()) return;

    animationStarted = true;

    addAnimationStyles();

    robot.addEventListener("click", handleRobotClick);

    document.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      moveEyes(event.clientX, event.clientY);
    }, { passive: true });

    robot.addEventListener("pointerleave", resetEyes);

    handleChatState();
    startIdleExpressions();

    setReaction("happy", 1500);
  }

  function watchForRobot() {
    if (initializeRobotAnimations()) return;

    const observer = new MutationObserver(() => {
      if (initializeRobotAnimations()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchForRobot, {
      once: true
    });
  } else {
    watchForRobot();
  }
})();

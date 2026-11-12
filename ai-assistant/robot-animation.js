(() => {
  "use strict";
  function init() {
    const a = document.getElementById("tcn-ai-assistant");
    if (a && !a.dataset.anim) {
      a.dataset.anim = "true";
      const s = document.createElement("style");
      s.textContent = `
        #tcn-ai-assistant .tcn-ai-robot-head {
          animation: floatBot 3s ease-in-out infinite;
        }
        @keyframes floatBot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `;
      document.head.appendChild(s);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


(() => {
  "use strict";

  function startRobotAnimation() {
    const robot = document.getElementById("tcnAiRobot");

    if (!robot || robot.dataset.animationReady === "true") return;

    robot.dataset.animationReady = "true";

    const eyes = robot.querySelectorAll(".tcn-robot-eye");

    // आँखों को mouse की दिशा में देखने देना
    document.addEventListener("mousemove", (event) => {
      const rect = robot.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angleX = (event.clientX - centerX) / window.innerWidth;
      const angleY = (event.clientY - centerY) / window.innerHeight;

      const moveX = Math.max(-2, Math.min(2, angleX * 5));
      const moveY = Math.max(-2, Math.min(2, angleY * 5));

      eyes.forEach((eye) => {
        eye.style.setProperty("--look-x", `${moveX}px`);
        eye.style.setProperty("--look-y", `${moveY}px`);
      });
    });

    // Robot के छोटे-छोटे reactions
    const reactions = ["is-happy", "is-curious"];

    function react() {
      const reaction = reactions[
        Math.floor(Math.random() * reactions.length)
      ];

      robot.classList.add(reaction);

      window.setTimeout(() => {
        robot.classList.remove(reaction);
      }, 1200);
    }

    // समय-समय पर friendly reaction
    window.setInterval(() => {
      if (!document.hidden) react();
    }, 9000);

    // पेज पर वापस आने पर robot react करे
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) react();
    });
  }

  // Assistant HTML लोड होने के बाद animation शुरू करें
  const waitForRobot = window.setInterval(() => {
    if (document.getElementById("tcnAiRobot")) {
      window.clearInterval(waitForRobot);
      startRobotAnimation();
    }
  }, 300);

  // अधिकतम 20 सेकंड तक प्रतीक्षा
  window.setTimeout(() => {
    window.clearInterval(waitForRobot);
  }, 20000);
})();

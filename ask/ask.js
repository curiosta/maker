// Opens the chat widget from the page button. The widget itself is loaded by assets/chat/chat-loader.js.
(function () {
  "use strict";
  var btn = document.getElementById("open-tutor");
  var status = document.getElementById("ask-status");
  if (!btn) return;
  function say(t) { if (status) status.textContent = t; }
  btn.addEventListener("click", function () {
    var tries = 0;
    say("Opening the tutor…");
    (function go() {
      var fab = document.querySelector(".btw-fab");
      if (fab) { fab.click(); say(""); return; }
      if (++tries > 40) { say("The tutor could not load. Check your connection, or reload the page."); return; }
      setTimeout(go, 250);
    })();
  });
})();

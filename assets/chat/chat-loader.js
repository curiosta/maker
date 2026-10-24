/*
 * Maker chat loader: adds the "Ask the Maker tutor" OpenRouter chat widget to the page.
 * Included on each page with ONE tag (no inline script, no per-page config):
 *   <script src="../assets/chat/chat-loader.js" defer></script>   (path relative to the page)
 * It works out its own folder from its src, so it does not depend on page depth.
 * Everything runs in the visitor's browser: no backend and no keys in this repo. The visitor connects their OWN
 * OpenRouter account (PKCE) and the key stays in their tab. Default model: free models only.
 * Hugging Face and Chrome on-device providers are OFF (no data-providers / data-hf-client-id attributes).
 */
(function () {
  "use strict";
  if (window.__makerChat) return;           // never load twice
  window.__makerChat = true;

  var me = document.currentScript;
  var base = "/assets/chat/";
  try { var u = new URL(me.src, location.href); base = u.href.slice(0, u.href.lastIndexOf("/") + 1); } catch (e) {}
  var indexUrl = "/site-index.json";
  try { indexUrl = new URL("../../site-index.json", base).pathname; } catch (e) {}

  function txt(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function clip(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }

  var path = location.pathname.replace(/index\.html$/, "");
  var h1 = txt(document.querySelector("main h1"));
  var isModule = /\/curriculum\/[^/]+\/$/.test(path);
  var suggestions;
  if (isModule && h1) {
    var mod = h1.replace(/^Module\s+\d+[:.]?\s*/i, "");
    suggestions = [
      clip("What does the official assignment ask for in " + mod + "?", 140),
      clip("What evidence should I document for " + mod + "?", 140),
      clip("What would bare-minimum vs exceptional work look like for " + mod + "?", 140),
      "What should I double-check on fabacademy.org for this module?"
    ];
  } else if (/\/curriculum\/$/.test(path)) {
    suggestions = [
      "I'm coming back after a break. Where should I start?",
      "Which modules have a worked bare-minimum vs exceptional rubric?",
      "What is the difference between bare-minimum and exceptional work?",
      "Which modules depend on each other for the final project?"
    ];
  } else {
    suggestions = [
      "What does bare-minimum vs exceptional mean on this site?",
      "I'm coming back after a break. Where should I start?",
      "What does the electronics design module ask for?",
      "Is this site official Fab Academy material?"
    ];
  }

  var persona = [
    "You are the Maker tutor on maker.curiosta.com, an UNOFFICIAL companion to the Fab Academy curriculum (fabacademy.org) for Fab Academy students. This site is not affiliated with, endorsed by, or part of Fab Academy or the Fab Foundation.",
    "Help students finish the course by understanding what each module's official assignment asks for and what bare-minimum and exceptional work could look like. The bare-minimum and exceptional criteria on this site are the author's interpretation, not official grading: say so whenever you describe them.",
    "Ground every answer in this site's pages and cite the pages you used as Markdown links. If the site does not cover something (or a rubric is marked TBC), say so briefly; give only general, well-established fabrication or electronics knowledge and label it as general knowledge.",
    "Always tell students that the authoritative requirements, deadlines and grading come from fabacademy.org, their instructor and their lab. Never claim that following this site guarantees a pass, never invent requirements, dates or policies, and never present yourself as official.",
    "Stay on topic: the Fab Academy modules, documentation, final project planning and coming back after a break. Politely decline unrelated requests. Do not write a student's assignment documentation for them; coach, explain and review instead.",
    "Safety: when a question touches machines, lasers, CNC milling, chemicals for molding and casting, soldering or mains power, add one short line saying to follow your lab's safety training and your instructor's guidance."
  ].join(" ");

  function load() {
    var sc = document.createElement("script");
    sc.src = base + "widget.js";
    sc.async = true;
    sc.setAttribute("data-site-name", "Maker tutor");
    sc.setAttribute("data-default-model", "openrouter/free");
    sc.setAttribute("data-context-selector", "main, body");
    sc.setAttribute("data-exclude", "nav, .site-header, .site-footer, .no-index");
    sc.setAttribute("data-index", indexUrl);
    sc.setAttribute("data-page-cap", "8000");
    sc.setAttribute("data-fab-label", "💬 Ask the tutor");
    sc.setAttribute("data-persona", persona);
    sc.setAttribute("data-suggestions", JSON.stringify(suggestions));
    sc.setAttribute("data-greeting", "Hi! I'm an unofficial Fab Academy companion. Ask me what a module's assignment asks for, or what bare-minimum vs exceptional could look like. I'll link the pages I use, and fabacademy.org is always the authority.");
    document.body.appendChild(sc);
  }

  // An OpenRouter sign-in return (?code=…&state=…) must be handled straight away; otherwise wait for idle
  // so the chat never competes with the page itself.
  if (/[?&](code|error|state|btw_debug)=/.test(location.search)) load();
  else if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 2500 });
  else setTimeout(load, 800);
})();

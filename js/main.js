(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Hero typing ----------
  var hero = document.getElementById("heroTerm");
  var lines = hero.querySelectorAll(".t-line, .t-out");

  function typeCommand(el, done) {
    var cmd = el.querySelector(".cmd");
    var full = cmd.textContent;
    cmd.textContent = "";
    el.classList.add("shown");
    cmd.classList.add("typing");
    var i = 0;
    (function step() {
      cmd.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(step, 45 + Math.random() * 55);
      else { cmd.classList.remove("typing"); setTimeout(done, 220); }
    })();
  }

  if (!reduceMotion) {
    root.classList.add("js");
    var idx = 0;
    (function next() {
      if (idx >= lines.length) return;
      var el = lines[idx++];
      if (el.hasAttribute("data-cmd")) typeCommand(el, next);
      else { el.classList.add("shown"); setTimeout(next, 260); }
    })();
  }

  // ---------- Reveal on scroll ----------
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Active tab ----------
  var tabs = document.querySelectorAll(".tabs a");
  if ("IntersectionObserver" in window) {
    var tabIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    tabs.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) tabIo.observe(s);
    });
  }

  // ---------- Interactive shell ----------
  var out = document.getElementById("shellOut");
  var form = document.getElementById("shellForm");
  var input = document.getElementById("shellIn");
  var shell = document.getElementById("shell");
  var history = [], hIdx = 0;

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function print(html) {
    var p = document.createElement("p");
    p.innerHTML = html;
    out.appendChild(p);
  }
  function link(href, text, ext) {
    return '<a class="c-green" href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + text + "</a>";
  }

  var commands = {
    help: function () {
      [
        '<span class="c-yellow">whoami</span>      who is this?',
        '<span class="c-yellow">about</span>       short bio',
        '<span class="c-yellow">experience</span>  work at Mindlinks',
        '<span class="c-yellow">projects</span>    side projects',
        '<span class="c-yellow">skills</span>      toolkit',
        '<span class="c-yellow">education</span>   degrees & certifications',
        '<span class="c-yellow">contact</span>     how to reach me',
        '<span class="c-yellow">resume</span>      open résumé (PDF)',
        '<span class="c-yellow">clear</span>       clear the screen'
      ].forEach(print);
    },
    whoami: function () { print('<span class="c-green">Nunna Sai Gowtham</span> — Software AI Developer @ Mindlinks, Bangalore'); },
    about: function () { print("2+ years turning messy, real-world images into reliable data: camera automation, OCR, document AI and market analytics."); },
    experience: function () {
      print('<span class="c-purple">Mindlinks Private Limited</span> · Software AI Developer · Jun 2024 – present');
      print('  <span class="c-blue">camera-capture/</span>   automated capture + 9 image quality checks');
      print('  <span class="c-blue">doc-extraction/</span>   multilingual OCR → structured records');
      print('  <span class="c-blue">trading-engine/</span>   daily stock & options analysis, CI/CD');
    },
    projects: function () {
      print("  " + link("https://github.com/NunnaSai/Game-Using-Hand-Gestures", "hand-gesture-game/", true));
      print("  " + link("https://github.com/NunnaSai/Driver-Fatigue-Monitoring-System", "driver-fatigue-monitor/", true));
      print("  " + link("https://github.com/NunnaSai/VOICE-BASED-VIRTUAL-ASSISTANT-FOR-WINDOWS", "voice-assistant/", true));
    },
    skills: function () {
      print('<span class="c-blue">languages</span>  Python, SQL, JavaScript');
      print('<span class="c-blue">ai/ml</span>      Machine Learning, Computer Vision, NLP, OpenCV');
      print('<span class="c-blue">doc-ai</span>     OCR, Image Processing, Prompt Engineering, Google Cloud Vision');
      print('<span class="c-blue">backend</span>    FastAPI, Flask, React, Pandas, NumPy, PostgreSQL');
      print('<span class="c-blue">devops</span>     Git, GitHub Actions, AWS S3');
      print('<span class="c-blue">ai-tools</span>   Claude Code, ChatGPT');
    },
    education: function () {
      print("B.Tech CSE (AI/ML) — SRM Institute of Science and Technology, 2024 · CGPA 8.41");
      print('certs: AWS ML · MATLAB Image Processing · Kaggle Python · HackerRank · Forage · 1Stop');
    },
    contact: function () {
      print("email     " + link("mailto:nvhrsgowtham03@gmail.com", "nvhrsgowtham03@gmail.com"));
      print("linkedin  " + link("https://www.linkedin.com/in/sai-gowtham-nunna-316137243/", "sai-gowtham-nunna", true));
      print("github    " + link("https://github.com/NunnaSai", "NunnaSai", true));
    },
    resume: function () {
      print("opening " + link("assets/Nunna_Sai_Gowtham_Resume.pdf", "./resume.pdf", true) + " …");
      window.open("assets/Nunna_Sai_Gowtham_Resume.pdf", "_blank", "noopener");
    },
    clear: function () { out.innerHTML = ""; },
    ls: function () { commands.experience(); },
    "sudo hire-me": function () {
      print('<span class="c-green">[sudo]</span> permission granted ✔');
      print("drafting an email to Gowtham… " + link("mailto:nvhrsgowtham03@gmail.com?subject=Let's%20talk", "click to send"));
    }
  };

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var raw = input.value.trim();
    input.value = "";
    print('<span class="ps1">~</span> <span class="ps2">❯</span> ' + esc(raw));
    if (raw) {
      history.push(raw); hIdx = history.length;
      var fn = commands[raw.toLowerCase()];
      if (fn) fn();
      else if (/^sudo\b/i.test(raw)) print('<span class="c-pink">nice try.</span> try <span class="c-yellow">sudo hire-me</span>');
      else print('<span class="c-pink">command not found:</span> ' + esc(raw) + ' — type <span class="c-yellow">help</span>');
    }
    shell.scrollTop = shell.scrollHeight;
  });
  input.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowUp" && hIdx > 0) { input.value = history[--hIdx]; ev.preventDefault(); }
    else if (ev.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; ev.preventDefault(); }
  });
  shell.addEventListener("click", function (ev) { if (ev.target.tagName !== "A") input.focus(); });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

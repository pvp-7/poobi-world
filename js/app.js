// =========================================================
// Poobi World — app.js
// Handles: password gate, starfield bg, mobile nav, content loading
// =========================================================

const PLAIN_PASSWORD = "Poobilu7"; // NOTE: static sites can't truly hide this — see README for context
const SESSION_KEY = "poobi-world-unlocked";

// ---------- Gate ----------
function initGate(){
  const gate = document.getElementById("gate");
  const site = document.getElementById("site");
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const error = document.getElementById("gate-error");

  function unlock(){
    gate.style.display = "none";
    site.hidden = false;
    sessionStorage.setItem(SESSION_KEY, "1");
    loadAllContent();
  }

  if (sessionStorage.getItem(SESSION_KEY) === "1"){
    unlock();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === PLAIN_PASSWORD){
      unlock();
    } else {
      error.classList.remove("show");
      void error.offsetWidth; // restart animation
      error.classList.add("show");
      input.value = "";
      input.focus();
    }
  });
}

// ---------- Starfield ----------
function initStars(){
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t){
    ctx.clearRect(0, 0, w, h);
    for (const s of stars){
      const alpha = 0.35 + 0.5 * Math.abs(Math.sin(s.phase + t * s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243,236,255,${alpha.toFixed(2)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

// ---------- Mobile nav ----------
function initNav(){
  const toggle = document.getElementById("nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// ---------- Content loading ----------
// Each section reads its own JSON file from /content. To add new entries,
// edit the matching file — no code changes needed. See README.md.

async function fetchJSON(path){
  try{
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (e){
    return [];
  }
}

function showEmpty(id, isEmpty){
  const el = document.getElementById(id);
  if (el) el.hidden = !isEmpty;
}

async function renderPhotos(){
  const items = await fetchJSON("content/photos.json");
  const grid = document.getElementById("photos-grid");
  showEmpty("photos-empty", items.length === 0);
  grid.innerHTML = items.map((p, i) => `
    <figure class="polaroid" style="--tilt:${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg">
      <img src="${p.image}" alt="${escapeHTML(p.caption || "")}" loading="lazy">
      <figcaption>${escapeHTML(p.caption || "")}${p.date ? ` · ${escapeHTML(p.date)}` : ""}</figcaption>
    </figure>
  `).join("");
}

async function renderStories(){
  const items = await fetchJSON("content/stories.json");
  const list = document.getElementById("stories-list");
  showEmpty("stories-empty", items.length === 0);
  list.innerHTML = items.map((s) => `
    <article class="story-card">
      <span class="story-date">${escapeHTML(s.date || "")}</span>
      <h3>${escapeHTML(s.title || "")}</h3>
      <p>${escapeHTML(s.body || "")}</p>
    </article>
  `).join("");
}

async function renderThoughts(){
  const items = await fetchJSON("content/thoughts.json");
  const grid = document.getElementById("thoughts-grid");
  showEmpty("thoughts-empty", items.length === 0);
  grid.innerHTML = items.map((t, i) => `
    <div class="note" style="--tilt:${(i % 2 === 0 ? 1 : -1) * (1 + (i % 3))}deg">
      <p>${escapeHTML(t.text || "")}</p>
      <span class="note-date">${escapeHTML(t.date || "")}</span>
    </div>
  `).join("");
}

async function renderMilestones(){
  const items = await fetchJSON("content/milestones.json");
  const wrap = document.getElementById("milestones-timeline");
  showEmpty("milestones-empty", items.length === 0);
  wrap.innerHTML = items.map((m) => `
    <div class="milestone">
      <span class="m-date">${escapeHTML(m.date || "")}</span>
      <h3>${escapeHTML(m.title || "")}</h3>
      <p>${escapeHTML(m.description || "")}</p>
    </div>
  `).join("");
}

async function renderVideos(){
  const items = await fetchJSON("content/videos.json");
  const grid = document.getElementById("videos-grid");
  showEmpty("videos-empty", items.length === 0);
  grid.innerHTML = items.map((v) => `
    <div class="video-card">
      <iframe class="video-frame" src="${v.embedUrl}" title="${escapeHTML(v.title || "video")}" loading="lazy" allowfullscreen></iframe>
      <div class="video-caption">${escapeHTML(v.title || "")}</div>
    </div>
  `).join("");
}

const BOOK_COLORS = ["#ffd9ef","#dccbff","#c3f7ec","#ffe9b3","#ffcbb3","#c9f7c3"];

async function renderBooks(){
  const items = await fetchJSON("content/books.json");
  const shelf = document.getElementById("books-shelf");
  showEmpty("books-empty", items.length === 0);
  shelf.innerHTML = items.map((b, i) => `
    <div class="book-spine" style="background:${BOOK_COLORS[i % BOOK_COLORS.length]}" title="${escapeHTML(b.title || "")}${b.status ? ` — ${escapeHTML(b.status)}` : ""}">
      ${escapeHTML(b.title || "")}
    </div>
  `).join("");
}

async function renderGames(){
  const items = await fetchJSON("content/games.json");
  const grid = document.getElementById("games-grid");
  showEmpty("games-empty", items.length === 0);
  grid.innerHTML = items.map((g) => `
    <div class="vault-card">
      <span class="vault-tag">${escapeHTML(g.status || "cleared")}</span>
      <h3>${escapeHTML(g.title || "")}</h3>
      <p>${escapeHTML(g.note || "")}</p>
    </div>
  `).join("");
}

function escapeHTML(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function loadAllContent(){
  renderPhotos();
  renderStories();
  renderThoughts();
  renderMilestones();
  renderVideos();
  renderBooks();
  renderGames();
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initNav();
  initGate();
});

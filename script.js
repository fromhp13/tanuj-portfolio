const loader = document.getElementById("loader");
const cursor = document.getElementById("cursor");
const particles = document.getElementById("particles");
const typing = document.getElementById("typing");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const scrollTop = document.getElementById("scrollTop");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const phrases = [
  "scalable web apps",
  "clean product interfaces",
  "reliable backend systems",
  "delightful user journeys"
];

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 650);
});

document.getElementById("year").textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☾";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☾" : "☀";
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.textContent = navLinks.classList.contains("open") ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

for (let index = 0; index < 36; index += 1) {
  const particle = document.createElement("span");
  particle.style.left = `${(index * 29) % 100}%`;
  particle.style.top = `${(index * 47) % 100}%`;
  particle.style.setProperty("--delay", `${(index % 9) * 0.45}s`);
  particle.style.setProperty("--duration", `${9 + (index % 7)}s`);
  particles.appendChild(particle);
}

let mouseX = -100;
let mouseY = -100;
let cursorX = -100;
let cursorY = -100;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  typing.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1150);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, deleting ? 34 : 58);
}
typeLoop();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      entry.target.querySelectorAll(".skill").forEach((skill) => {
        const level = skill.dataset.level;
        skill.querySelector("b").style.width = `${level}%`;
      });

      entry.target.querySelectorAll("[data-count]").forEach((counter) => {
        animateCounter(counter);
      });
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.querySelectorAll(".skill-card, .stats").forEach((element) => revealObserver.observe(element));

const navAnchors = [...navLinks.querySelectorAll("a")];
const sections = navAnchors.map((link) => document.querySelector(link.getAttribute("href")));

window.addEventListener(
  "scroll",
  () => {
    scrollTop.classList.toggle("visible", window.scrollY > 720);
    let current = "home";
    sections.forEach((section) => {
      if (section && section.offsetTop - 140 <= window.scrollY) current = section.id;
    });
    navAnchors.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  },
  { passive: true }
);

scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function animateCounter(counter) {
  if (counter.dataset.done) return;
  counter.dataset.done = "true";
  const target = Number(counter.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = Math.round(target * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get("email") || "");
  const message = String(data.get("message") || "").trim();

  if (!email.includes("@") || message.length < 10) {
    formStatus.textContent = "Please use a valid email and a longer message.";
    formStatus.style.color = "var(--ember)";
    return;
  }

  formStatus.textContent = "Message validated locally. Ready to connect.";
  formStatus.style.color = "var(--signal)";
  form.reset();
});

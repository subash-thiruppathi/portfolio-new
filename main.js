(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Nav: scrolled state, mobile menu, active link ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const navLinks = $("#navLinks");

  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("is-open", open);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      burger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });

  const sectionIds = ["top", "about", "expertise", "skills", "experience", "projects", "contact"];
  const linkFor = Object.fromEntries($$("[data-link]").map((a) => [a.dataset.link, a]));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        Object.values(linkFor).forEach((a) => a.classList.remove("is-active"));
        linkFor[en.target.id]?.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* ---------- Hero: scroll-scrubbed timeline ---------- */
  const hero = $(".hero");
  const sticky = $(".hero__sticky");
  const photo = $(".hero__photo");
  const l1 = $("#heroL1");
  const l2 = $("#heroL2");
  const stageEl = $("#heroStage");
  const stages = [
    ["CREATIVE", "DEVELOPER"],
    ["FULL STACK", "ENGINEER"],
    ["SCALABLE", "SYSTEMS"],
  ];
  let currentStage = 0;

  const setStage = (i) => {
    if (i === currentStage) return;
    currentStage = i;
    [l1, l2].forEach((el, k) => {
      el.textContent = stages[i][k];
      el.classList.remove("is-swapping");
      void el.offsetWidth; // restart animation
      el.classList.add("is-swapping");
    });
    stageEl.textContent = String(i + 1).padStart(2, "0");
  };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const updateHero = () => {
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / (total || 1));
    sticky.style.setProperty("--p", p.toFixed(4));

    setStage(Math.min(2, Math.floor(p * 3 + 0.0001)));

    if (!reduceMotion) {
      const mobile = window.innerWidth <= 900;
      // Stage 1: settle in. Stage 2: drift right & sharpen. Stage 3: drift left, dim toward exit.
      const s = ease(clamp(p / 0.33));
      const t2 = ease(clamp((p - 0.33) / 0.33));
      const t3 = ease(clamp((p - 0.66) / 0.34));
      const shift = mobile ? 0 : window.innerWidth * 0.06;
      const px = lerp(0, shift, t2) + lerp(0, -shift * 2, t3);
      const scale = lerp(1.1, 1.0, s) + lerp(0, 0.06, t3);
      photo.style.setProperty("--px", `${px.toFixed(1)}px`);
      photo.style.setProperty("--ps", scale.toFixed(4));
      photo.style.setProperty("--pg", lerp(0.15, 0.6, t3).toFixed(3));
      photo.style.setProperty("--pb", lerp(1, 0.75, t3).toFixed(3));
    }
  };

  /* ---------- Projects: echo heading ---------- */
  const echo = $(".echo__title");
  const updateEcho = () => {
    if (!echo || reduceMotion) return;
    const r = echo.getBoundingClientRect();
    const vh = window.innerHeight;
    // 1 when heading enters from bottom, 0 when it's around the upper third
    const e = clamp((r.top - vh * 0.3) / (vh * 0.6));
    echo.style.setProperty("--e", (e * 0.55).toFixed(3));
  };

  /* ---------- Footer wordmark rise ---------- */
  const wordmark = $("#wordmark");
  const updateWord = () => {
    if (!wordmark || reduceMotion) return;
    const r = wordmark.parentElement.getBoundingClientRect();
    const t = clamp((window.innerHeight - r.top) / r.height);
    wordmark.style.setProperty("--wy", `${lerp(40, 0, ease(t)).toFixed(1)}%`);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
      updateHero();
      updateEcho();
      updateWord();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        revealIO.unobserve(en.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );
  // Stagger siblings inside grids
  $$(".roadmap__grid, .proj__grid, .exp__list, .stats").forEach((grid) => {
    $$(".reveal", grid).forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`));
  });
  $$(".reveal").forEach((el) => revealIO.observe(el));

  /* ---------- Stat counters ---------- */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        $$("[data-count]", en.target).forEach((b) => {
          const to = Number(b.dataset.count);
          const suffix = b.dataset.suffix || "";
          if (reduceMotion) { b.textContent = to + suffix; return; }
          const start = performance.now();
          const dur = 1400;
          const step = (now) => {
            const t = clamp((now - start) / dur);
            b.textContent = Math.round(to * ease(t)) + suffix;
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      });
    },
    { threshold: 0.4 }
  );
  const stats = $(".stats");
  if (stats) countIO.observe(stats);

  /* ---------- Skills ---------- */
  const skills = {
    lang: { color: "#fbbf24", items: ["JavaScript", "TypeScript", "HTML5", "CSS3", "SQL"] },
    fe: { color: "#60a5fa", items: ["React", "Angular", "React Native", "Vue.js", "Ionic"] },
    be: { color: "#a78bfa", items: ["Node.js", "NestJS", "Express.js", "Spring Boot", "REST APIs", "Swagger / OpenAPI", "JWT", "RBAC", "Webhooks", "Microservices"] },
    db: { color: "#34d399", items: ["MySQL", "PostgreSQL", "Ingres DB", "Redis"] },
    ops: { color: "#f472b6", items: ["AWS", "Docker", "Terraform", "Jenkins", "GitHub Actions", "PM2", "Nginx", "Linux"] },
    data: { color: "#fb923c", items: ["Apache Kafka", "Kafka Connect", "Debezium", "Dagster", "Medallion Architecture", "Prometheus", "Loki"] },
    more: { color: "#e5e7eb", items: ["Google Play Store", "Apple App Store", "TestFlight", "Claude Code", "Cursor", "GitHub Copilot", "ChatGPT", "Git", "Postman", "Jira", "DBeaver", "VS Code"] },
  };
  const pills = $("#pills");
  const frag = document.createDocumentFragment();
  Object.entries(skills).forEach(([cat, { color, items }]) => {
    items.forEach((name) => {
      const li = document.createElement("li");
      li.className = "pill";
      li.dataset.cat = cat;
      li.style.setProperty("--c", color);
      li.textContent = name;
      frag.appendChild(li);
    });
  });
  pills.appendChild(frag);

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      const f = chip.dataset.filter;
      $$(".pill", pills).forEach((p) => p.classList.toggle("is-dim", f !== "all" && p.dataset.cat !== f));
    });
  });

  /* ---------- Pointer effects (desktop only) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    const glow = $(".cursor-glow");
    window.addEventListener("pointermove", (e) => {
      glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
    }, { passive: true });

    const card = $("#tilt");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });

    $$(".proj").forEach((p) => {
      p.addEventListener("pointermove", (e) => {
        const r = p.getBoundingClientRect();
        p.style.setProperty("--mx", `${e.clientX - r.left}px`);
        p.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
  // cursor-glow uses transform directly; reset its CSS centering
  $(".cursor-glow").style.left = "0";

  /* ---------- Contact form -> opens the visitor's mail app ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let bad = false;
    ["first", "email", "message"].forEach((k) => {
      const field = form.elements[k];
      const invalid = !field.value.trim() || (k === "email" && !field.checkValidity());
      field.classList.toggle("is-invalid", invalid);
      bad ||= invalid;
    });
    if (bad) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      status.className = "mono form__status is-error";
      return;
    }
    const name = `${data.first} ${data.last || ""}`.trim();
    const subject = `Portfolio enquiry from ${name}`;
    const body = `${data.message}\n\n— ${name}\n${data.email}`;
    window.location.href = `mailto:subashthiruppathy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Opening your email app…";
    status.className = "mono form__status is-ok";
  });

  $("#year").textContent = new Date().getFullYear();
})();

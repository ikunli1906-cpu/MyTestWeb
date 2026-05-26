/* ============================================
   main.js — 导航交互 & 滚动效果
   ============================================ */
(function () {
  "use strict";

  /* ---------- 导航栏滚动效果 ---------- */
  const navbar = document.getElementById("navbar");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 汉堡菜单 ---------- */
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  /* ---------- 页脚年份 ---------- */
  const yearEls = document.querySelectorAll("#footerYear");
  const y = new Date().getFullYear();
  yearEls.forEach(el => (el.textContent = y));

  /* ---------- 滚动渐入动画 ---------- */
  const fadeEls = document.querySelectorAll(
    ".feature-card, .service-card, .timeline-item, .contact-item, .about-preview-grid, .about-detail-grid"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach(el => {
      el.classList.add("fade-in");
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(el => el.classList.add("visible"));
  }

  /* ---------- 联系表单（前端验证 + 模拟提交） ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.textContent = "提交中...";
      btn.disabled = true;
      setTimeout(() => {
        alert("感谢您的留言！我们会尽快与您联系。");
        form.reset();
        btn.textContent = "提交留言";
        btn.disabled = false;
      }, 1000);
    });
  }
})();

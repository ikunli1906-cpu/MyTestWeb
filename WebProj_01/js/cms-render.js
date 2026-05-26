/* ============================================
   cms-render.js — 从 _data/*.json 渲染页面内容
   ============================================ */
(function () {
  "use strict";

  /** 安全获取 DOM 元素 */
  function el(id) {
    return document.getElementById(id);
  }

  /** 简单 HTML 转义 */
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  /** 加载 JSON，失败不抛错 */
  async function loadJSON(file) {
    try {
      const r = await fetch(file + "?v=" + Date.now());
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  /** 渲染公司名称（全局） */
  function renderCompanyName(data) {
    const name = data.companyName || "公司名称";
    window.__COMPANY_NAME__ = name;
    const ids = [
      "navCompanyName", "footerCompanyName", "footerCompanyName2",
      "footerCompanyName2"
    ];
    ids.forEach(id => {
      const e = el(id);
      if (e) e.textContent = name;
    });
  }

  /** 渲染首页 Hero */
  function renderHero(data) {
    if (!data) return;
    const t = el("heroTitle");
    if (t && data.heroTitle) t.textContent = data.heroTitle;
    const s = el("heroSubtitle");
    if (s && data.heroSubtitle) s.textContent = data.heroSubtitle;
  }

  /** 渲染首页关于预览 */
  function renderAboutPreview(data) {
    if (!data) return;
    const t = el("aboutPreviewContent");
    if (t && data.description) t.textContent = data.description.slice(0, 200) + "...";
  }

  /** 渲染关于页面 */
  function renderAboutDetail(data) {
    if (!data) return;
    const t = el("aboutDetailContent");
    if (t && data.description) t.innerHTML = "<p>" + esc(data.description).replace(/\n/g, "</p><p>") + "</p>";

    /* 时间轴 */
    const tl = el("timeline");
    if (tl && Array.isArray(data.history)) {
      tl.innerHTML = data.history
        .map(
          h =>
            '<div class="timeline-item">' +
              '<div class="timeline-dot"></div>' +
              '<div class="timeline-year">' + esc(h.year) + "</div>" +
              '<div class="timeline-title">' + esc(h.title || "") + "</div>" +
              '<div class="timeline-event">' + esc(h.event) + "</div>" +
            "</div>"
        )
        .join("");
    }
  }

  /** 渲染服务卡片 */
  function renderServices(data, containerId, max) {
    const grid = el(containerId);
    if (!grid || !data || !Array.isArray(data.items)) return;
    const items = max ? data.items.slice(0, max) : data.items;
    grid.innerHTML = items
      .map(
        s =>
          '<div class="service-card">' +
            '<img src="' + esc(s.icon || "https://placehold.co/400x200/eee/999?text=Service") + '"' +
            ' alt="' + esc(s.name) + '"' +
            ' onerror="this.src=\'https://placehold.co/400x200/eee/999?text=Service\'" />' +
            '<div class="service-card-body">' +
              "<h3>" + esc(s.name) + "</h3>" +
              "<p>" + esc(s.desc || "") + "</p>" +
            "</div>" +
          "</div>"
      )
      .join("");
  }

  /** 渲染联系页面 */
  function renderContact(data) {
    if (!data) return;
    const fields = [
      ["address", "contactAddress",   "footerAddress",  "footerAddress2"],
      ["phone",   "contactPhone",     "footerPhone",    "footerPhone2"],
      ["email",   "contactEmail",     "footerEmail",    "footerEmail2"],
    ];
    fields.forEach(([key, ...ids]) => {
      if (!data[key]) return;
      ids.forEach(id => {
        const e = el(id);
        if (e) e.textContent = data[key];
      });
    });

    /* 地图坐标 */
    if (data.lng && data.lat) {
      window.__MAP_LNG__ = parseFloat(data.lng);
      window.__MAP_LAT__ = parseFloat(data.lat);
    }
  }

  /** 渲染页脚描述 */
  function renderFooter(data) {
    const desc = data.description || "";
    const short = desc.slice(0, 80) + (desc.length > 80 ? "..." : "");
    ["footerDesc"].forEach(id => {
      const e = el(id);
      if (e) e.textContent = short;
    });
  }

  /* ============ 主流程 ============ */
  async function main() {
    const [aboutData, servicesData, contactData] = await Promise.all([
      loadJSON("_data/about.json"),
      loadJSON("_data/services.json"),
      loadJSON("_data/contact.json"),
    ]);

    /* 全局公司名 */
    if (aboutData) renderCompanyName(aboutData);
    if (aboutData) renderFooter(aboutData);

    /* 首页 */
    renderHero(aboutData);
    renderAboutPreview(aboutData);
    renderServices(servicesData, "servicesGrid", 3);

    /* 关于页面 */
    renderAboutDetail(aboutData);

    /* 服务页面 */
    renderServices(servicesData, "servicesFullGrid");

    /* 联系页面 */
    renderContact(contactData);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();

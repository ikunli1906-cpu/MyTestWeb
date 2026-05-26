/* ============================================
   cms-render.js — 从 _data/*.json 渲染页面内容
   内置回退数据，确保在任何环境都能正常渲染
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

  /** 内置回退数据（fetch 失败时使用） */
  var FALLBACK = {
    about: {
      "companyName": "金鹰陶瓷砖",
      "description": "金鹰陶陶瓷时时紧跟世界的脚步，不断的学习、研究和引进吸收世界先进的技术，研究出属于自己特色的产品，每一款产品的各项质量指标均达到了现行国家对建筑材料的有关规定及标准。创新求变，追求卓越，金鹰陶陶瓷一直将创新视为品牌持续发展的动力，技术创新从未止步，产品研发引领行业潮流。\u201c品质生活\u201d一直是我们的理想追求，一直激励着我们致力于创造完美产品，让消费者享有品质生活。金鹰陶陶瓷将持续以\u201c品质生活倡导者\u201d为宗旨，全方位的提升品牌形象，并以其强大的实力和高新技术，积极响应国家节能减排号召，推动产业升级及清洁生产，不断推出市场潮流的陶瓷精品。让普天下之家均可创享品质生活，这是金鹰陶陶瓷的品牌使命。",
      "heroTitle": "品质生活倡导者",
      "heroSubtitle": "让普天下之家均可创享品质生活",
      "history": [
        { "year": "2022", "title": "梦想与起航", "event": "乘风破浪拓市场、一展宏图创辉煌" },
        { "year": "2018", "title": "深耕与落地", "event": "斥巨资引进国际先进设备，打造岩板家居行业巨擎" },
        { "year": "2016", "title": "理解与深研", "event": "剖析行业品类新风口，新物种的出现未来可期" },
        { "year": "2013", "title": "探索与谋局", "event": "洞察行业趋势探索发展新机遇，筹谋布局未来战略蓝图" }
      ]
    },
    services: {
      "items": [
        {
          "name": "网络安全服务",
          "desc": "提供全面的网络安全评估、渗透测试、安全加固等服务，保障企业信息资产安全。",
          "icon": "https://placehold.co/64x64/1a365d/ffffff?text=SEC"
        },
        {
          "name": "企业信息化咨询",
          "desc": "为企业提供数字化转型规划、IT架构设计、系统集成等全方位咨询服务。",
          "icon": "https://placehold.co/64x64/2a4a7f/ffffff?text=IT"
        },
        {
          "name": "云计算服务",
          "desc": "提供公有云、私有云、混合云的整体解决方案，助力企业上云用云。",
          "icon": "https://placehold.co/64x64/c9a84c/ffffff?text=CLOUD"
        },
        {
          "name": "数据分析服务",
          "desc": "基于大数据和AI技术，为企业提供数据采集、分析、可视化等一站式服务。",
          "icon": "https://placehold.co/64x64/1a365d/ffffff?text=DATA"
        },
        {
          "name": "系统集成服务",
          "desc": "提供软硬件系统集成、网络工程、机房建设等一站式系统解决方案。",
          "icon": "https://placehold.co/64x64/2a4a7f/ffffff?text=SYS"
        },
        {
          "name": "运维支持服务",
          "desc": "7x24小时IT运维支持，包括故障处理、性能优化、定期巡检等服务。",
          "icon": "https://placehold.co/64x64/c9a84c/ffffff?text=OPS"
        }
      ]
    },
    contact: {
      "address": "佛山市禅城区南庄镇华夏陶瓷博览城陶博大道20座",
      "phone": "400-0757-603",
      "email": "2748574350@qq.com",
      "hours": "周一至周五 9:00-18:00",
      "lng": 113.03,
      "lat": 23.00
    }
  };

  /** 加载 JSON，失败返回 null */
  async function loadJSON(file) {
    try {
      var r = await fetch(file + "?v=" + Date.now());
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  /** 渲染公司名称（全局） */
  function renderCompanyName(data) {
    var name = data.companyName || "公司名称";
    var ids = [
      "navCompanyName", "footerCompanyName", "footerCompanyName2"
    ];
    ids.forEach(function(id) {
      var e = el(id);
      if (e) e.textContent = name;
    });
  }

  /** 渲染首页 Hero */
  function renderHero(data) {
    if (!data) return;
    var t = el("heroTitle");
    if (t && data.heroTitle) t.textContent = data.heroTitle;
    var s = el("heroSubtitle");
    if (s && data.heroSubtitle) s.textContent = data.heroSubtitle;
  }

  /** 渲染首页关于预览 */
  function renderAboutPreview(data) {
    if (!data) return;
    var t = el("aboutPreviewContent");
    if (t && data.description) t.textContent = data.description.slice(0, 200) + "...";
  }

  /** 渲染关于页面 */
  function renderAboutDetail(data) {
    if (!data) return;
    var t = el("aboutDetailContent");
    if (t && data.description) {
      t.innerHTML = "<p>" + esc(data.description).replace(/\n/g, "</p><p>") + "</p>";
    }

    /* 时间轴 */
    var tl = el("timeline");
    if (tl && Array.isArray(data.history)) {
      tl.innerHTML = data.history.map(function(h) {
        return '<div class="timeline-item">' +
          '<div class="timeline-dot"></div>' +
          '<div class="timeline-year">' + esc(h.year) + "</div>" +
          '<div class="timeline-title">' + esc(h.title || "") + "</div>" +
          '<div class="timeline-event">' + esc(h.event) + "</div>" +
        "</div>";
      }).join("");
    }
  }

  /** 渲染服务卡片 */
  function renderServices(data, containerId, max) {
    var grid = el(containerId);
    if (!grid || !data || !Array.isArray(data.items)) return;
    var items = max ? data.items.slice(0, max) : data.items;
    grid.innerHTML = items.map(function(s) {
      return '<div class="service-card">' +
        '<img src="' + esc(s.icon || "https://placehold.co/400x200/eee/999?text=Service") + '"' +
        ' alt="' + esc(s.name) + '"' +
        ' onerror="this.src=\'https://placehold.co/400x200/eee/999?text=Service\'" />' +
        '<div class="service-card-body">' +
          "<h3>" + esc(s.name) + "</h3>" +
          "<p>" + esc(s.desc || "") + "</p>" +
        "</div>" +
      "</div>";
    }).join("");
  }

  /** 渲染联系页面 */
  function renderContact(data) {
    if (!data) return;
    var fields = [
      ["address", "contactAddress", "footerAddress", "footerAddress2"],
      ["phone",   "contactPhone",   "footerPhone",   "footerPhone2"],
      ["email",   "contactEmail",   "footerEmail",   "footerEmail2"]
    ];
    fields.forEach(function(item) {
      var key = item[0];
      if (!data[key]) return;
      for (var i = 1; i < item.length; i++) {
        var e = el(item[i]);
        if (e) e.textContent = data[key];
      }
    });
  }

  /** 渲染页脚描述 */
  function renderFooter(data) {
    var desc = data.description || "";
    var short = desc.slice(0, 80) + (desc.length > 80 ? "..." : "");
    ["footerDesc"].forEach(function(id) {
      var e = el(id);
      if (e) e.textContent = short;
    });
  }

  /* ============ 主流程 ============ */
  function main() {
    /* 先尝试 fetch JSON，失败则使用内置回退数据 */
    Promise.all([
      loadJSON("_data/about.json"),
      loadJSON("_data/services.json"),
      loadJSON("_data/contact.json")
    ]).then(function(results) {
      var aboutData = results[0] || FALLBACK.about;
      var servicesData = results[1] || FALLBACK.services;
      var contactData = results[2] || FALLBACK.contact;

      /* 全局公司名 */
      renderCompanyName(aboutData);
      renderFooter(aboutData);

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
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();

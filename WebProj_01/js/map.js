/* ============================================
   map.js — 百度地图初始化
   ============================================ */
(function () {
  "use strict";

  /* 默认坐标（北京天安门，用户可在 CMS 中修改） */
  const DEFAULT_LNG = 116.397428;
  const DEFAULT_LAT = 39.90923;

  /** 从 URL 参数或 CMS 数据获取坐标 */
  function getCoords() {
    const p = new URLSearchParams(location.search);
    return {
      lng: parseFloat(p.get("lng")) || window.__MAP_LNG__ || DEFAULT_LNG,
      lat: parseFloat(p.get("lat")) || window.__MAP_LAT__ || DEFAULT_LAT,
    };
  }

  function initMap() {
    const container = document.getElementById("mapContainer");
    if (!container || typeof BMap === "undefined") return;

    const { lng, lat } = getCoords();
    const map = new BMap.Map("mapContainer");
    const point = new BMap.Point(lng, lat);

    map.centerAndZoom(point, 16);
    map.enableScrollWheelZoom(true);

    /* 自定义标记图标（圆形水波） */
    const marker = new BMap.Marker(point);
    map.addOverlay(marker);

    /* 信息窗口 */
    const info = new BMap.InfoWindow(
      '<div style="font-size:14px;font-weight:600;color:#1a365d;">' +
      (window.__COMPANY_NAME__ || "公司位置") +
      "</div>",
      { width: 200, height: 40, title: "" }
    );
    marker.addEventListener("click", () => map.openInfoWindow(info, point));
    map.openInfoWindow(info, point);
  }

  /* 等待百度 API 加载完毕 */
  if (typeof BMap !== "undefined") {
    initMap();
  } else {
    window.addEventListener("load", () => {
      if (typeof BMap !== "undefined") initMap();
    });
  }
})();

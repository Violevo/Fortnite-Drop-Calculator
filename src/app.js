const CONFIG = {
  busSpeed: 1100 / 15,
  pixelsToMeters: 490 / 335,
  fortniteApiBase: 'https://fortnite-api.com',
  fallbackBlank: 'https://fortnite-api.com/images/map.png',
  fallbackPOIs: 'https://fortnite-api.com/images/map_en.png'
};

const state = {
  map: null,
  imageOverlay: null,
  mapWidth: null,
  mapHeight: null,
  busStartMarker: null,
  busEndMarker: null,
  targetMarker: null,
  deployMarker: null,
  jumpMarker: null,
  busLine: null,
  freefallLine: null,
  glideLine: null,
  apiLabels: false,
  rafPending: false
};

function toPoint(latlng) {
  return { x: latlng.lng, y: latlng.lat };
}

function toLatLng(point) {
  return L.latLng(point.y, point.x);
}

function dot(u, v) {
  return u.x * v.x + u.y * v.y;
}

function distance(P, Q) {
  const dx = Q.x - P.x;
  const dy = Q.y - P.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalize(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len < 1e-9) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function subtract(A, B) {
  return { x: A.x - B.x, y: A.y - B.y };
}

function add(A, B) {
  return { x: A.x + B.x, y: A.y + B.y };
}

function scale(v, s) {
  return { x: v.x * s, y: v.y * s };
}

function pointOnSegment(A, B, t) {
  const AB = subtract(B, A);
  return add(A, scale(AB, t));
}

function computeOptimalJumpAndGlide(A, B, T) {
  const pToM = CONFIG.pixelsToMeters;

  // Physics Constants
  const v_bus = 73.3;        // m/s
  const v_fall_h = 14.5;     // m/s
  const v_fall_v = 32.0;     // m/s
  const v_glide_h = 17;      // m/s
  const v_glide_v = 7;       // m/s
  const H_bus = 832.0;       // m
  const H_deploy = 30.0;     // m

  const N = 400; // Sample count for optimization
  const H_total_drop = H_bus - H_deploy;
  const t_fall_max = H_total_drop / v_fall_v;
  const d_fall_max_meters = v_fall_h * t_fall_max;
  const t_glide_min_height = H_deploy / v_glide_v;
  const d_glide_min_height = v_glide_h * t_glide_min_height;
  const d_standard_max = d_fall_max_meters + d_glide_min_height;

  let minTotalTime = Infinity;
  let bestContext = null;

  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const J = pointOnSegment(A, B, t);
    const d_meters = distance(J, T) * pToM;

    let t_fall = 0, t_glide = 0;
    let d_fall_actual = 0, d_glide_actual = 0;
    let valid = false, G_candidate = null;

    if (d_meters <= d_standard_max) {
      const d_fall_cap = Math.min(d_meters, d_fall_max_meters);
      const d_remaining = d_meters - d_fall_cap;
      const d_glide_req = Math.max(d_remaining, d_glide_min_height);
      const dir = normalize(subtract(T, J));
      G_candidate = subtract(T, scale(dir, d_glide_req / pToM));

      const dist_J_G_meters = distance(J, G_candidate) * pToM;

      if (dist_J_G_meters <= d_fall_max_meters + 1) {
        valid = true;
        d_fall_actual = dist_J_G_meters;
        d_glide_actual = d_glide_req;
        t_fall = t_fall_max;
        t_glide = d_glide_actual / v_glide_h;
      }
    } else {
      const ratio = v_glide_h / v_glide_v;
      const C1 = v_fall_h - (v_fall_v * ratio);
      const C2 = ratio * H_bus;
      const t_f = (d_meters - C2) / C1;
      const t_g = (H_bus - v_fall_v * t_f) / v_glide_v;

      if (t_f >= 0 && t_g >= 0) {
        valid = true;
        t_fall = t_f; t_glide = t_g;
        d_fall_actual = v_fall_h * t_fall;
        d_glide_actual = v_glide_h * t_glide;
        const dir = normalize(subtract(T, J));
        G_candidate = add(J, scale(dir, d_fall_actual / pToM));
      }
    }

    if (!valid || !G_candidate) continue;

    const t_bus = distance(A, J) / v_bus * pToM;
    const t_total_calc = t_bus + t_fall + t_glide;

    if (t_total_calc < minTotalTime) {
      minTotalTime = t_total_calc;
      bestContext = { reachable: true, t_total: t_total_calc, t_bus, t_fall, t_glide, d_fall_meters: d_fall_actual, d_glide_meters: d_glide_actual, J, G: G_candidate };
    }
  }

  return bestContext || { reachable: false, t_total: Infinity };
}

function initMap() {
  state.map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 2,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    attributionControl: false
  });
  state.map.on('click', onMapClick);
  setTimeout(() => state.map.invalidateSize(), 0);
}

async function getMapImageUrl() {
  try {
    const response = await fetch(`${CONFIG.fortniteApiBase}/v1/map`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    if (data && data.data && data.data.images) {
      return state.apiLabels
        ? (data.data.images.pois || CONFIG.fallbackPOIs)
        : (data.data.images.blank || CONFIG.fallbackBlank);
    }
  } catch (error) {
    console.warn('Map API failed, using fallback');
  }
  return state.apiLabels ? CONFIG.fallbackPOIs : CONFIG.fallbackBlank;
}

async function loadMapImage() {
  const url = await getMapImageUrl();
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const oldW = state.mapWidth, oldH = state.mapHeight;
    const newW = img.naturalWidth, newH = img.naturalHeight;
    state.mapWidth = newW; state.mapHeight = newH;
    const bounds = [[0, 0], [newH, newW]];

    if (state.imageOverlay) state.map.removeLayer(state.imageOverlay);
    state.imageOverlay = L.imageOverlay(url, bounds).addTo(state.map).bringToBack();
    state.map.fitBounds(bounds); state.map.setMaxBounds(bounds);

    if (oldW && oldH) rescaleMarkers(oldW, oldH, newW, newH);
    else initializeDefaultMarkers();

    state.map.invalidateSize();
    setTimeout(recompute, 100);
  };
  img.src = url;
}

function initializeDefaultMarkers() {
  if (!state.mapWidth || !state.mapHeight) return;
  const w = state.mapWidth, h = state.mapHeight;
  createBusMarkers({ x: w * 0.1, y: h * 0.3 }, { x: w * 0.9, y: h * 0.3 });
}

function rescaleMarkers(oldW, oldH, newW, newH) {
  const scaleX = newW / oldW, scaleY = newH / oldH;
  const rescale = (m) => {
    if (!m) return null;
    const p = toPoint(m.getLatLng());
    const np = { x: p.x * scaleX, y: p.y * scaleY };
    m.setLatLng(toLatLng(np));
    return np;
  };
  if (state.busStartMarker) {
    const ns = rescale(state.busStartMarker);
    const ne = rescale(state.busEndMarker);
    if (ns && ne) updateBusLine(ns, ne);
  }
  rescale(state.targetMarker); rescale(state.deployMarker); rescale(state.jumpMarker);
}

function createMarkerIcon(cls, label = '') {
  return L.divIcon({
    className: 'leaflet-div-icon',
    html: `<div class="custom-marker ${cls}">${label}</div>`,
    iconSize: [24, 24], iconAnchor: [12, 12]
  });
}

function createBusMarkers(s, e) {
  if (state.busStartMarker) state.map.removeLayer(state.busStartMarker);
  if (state.busEndMarker) state.map.removeLayer(state.busEndMarker);
  if (state.busLine) state.map.removeLayer(state.busLine);

  state.busStartMarker = L.marker(toLatLng(s), { icon: createMarkerIcon('bus-start', 'S'), draggable: true }).addTo(state.map);
  state.busEndMarker = L.marker(toLatLng(e), { icon: createMarkerIcon('bus-end', 'E'), draggable: true }).addTo(state.map);
  state.busLine = L.polyline([toLatLng(s), toLatLng(e)], { color: '#ffffff', weight: 3, opacity: 0.7, dashArray: '10, 10' }).addTo(state.map);

  [state.busStartMarker, state.busEndMarker].forEach(m => {
    m.on('drag', throttledRecompute);
    m.on('dragend', recompute);
  });
}

function updateBusLine(s, e) {
  if (state.busLine) state.busLine.setLatLngs([toLatLng(s), toLatLng(e)]);
}

function createOrUpdateTarget(pos) {
  if (state.targetMarker) state.targetMarker.setLatLng(toLatLng(pos));
  else {
    state.targetMarker = L.marker(toLatLng(pos), { icon: createMarkerIcon('target', 'T'), draggable: true }).addTo(state.map);
    state.targetMarker.on('drag', throttledRecompute).on('dragend', recompute);
  }
}

function updateVisualElements(res, T) {
  const updateMarker = (key, cls, lbl, pos) => {
    if (state[key]) state[key].setLatLng(toLatLng(pos));
    else state[key] = L.marker(toLatLng(pos), { icon: createMarkerIcon(cls, lbl), interactive: false, zIndexOffset: 1000 }).addTo(state.map);
  };
  updateMarker('deployMarker', 'deploy', 'G', res.G);
  updateMarker('jumpMarker', 'jump', 'J', res.J);

  const ff = [toLatLng(res.J), toLatLng(res.G)];
  if (state.freefallLine) state.freefallLine.setLatLngs(ff);
  else state.freefallLine = L.polyline(ff, { color: '#ef4444', weight: 3, opacity: 0.8, dashArray: '8, 6' }).addTo(state.map);

  const gl = [toLatLng(res.G), toLatLng(T)];
  if (state.glideLine) state.glideLine.setLatLngs(gl);
  else state.glideLine = L.polyline(gl, { color: '#4ade80', weight: 3, opacity: 0.8 }).addTo(state.map);
}

function hideComputedMarkers() {
  ['deployMarker', 'jumpMarker', 'freefallLine', 'glideLine'].forEach(k => {
    if (state[k]) { state.map.removeLayer(state[k]); state[k] = null; }
  });
}

function onMapClick(e) {
  createOrUpdateTarget(toPoint(e.latlng));
  recompute();
}

function throttledRecompute() {
  if (state.rafPending) return;
  state.rafPending = true;
  requestAnimationFrame(() => { recompute(); state.rafPending = false; });
}

function recompute() {
  try {
    if (state.busStartMarker && state.busEndMarker) {
      const s = toPoint(state.busStartMarker.getLatLng()), e = toPoint(state.busEndMarker.getLatLng());
      updateBusLine(s, e);
      if (!state.targetMarker) return hideComputedMarkers();
      const T = toPoint(state.targetMarker.getLatLng());
      if (distance(s, e) < 1) return hideComputedMarkers();
      const res = computeOptimalJumpAndGlide(s, e, T);
      if (!res.reachable) return hideComputedMarkers();
      updateVisualElements(res, T);
    }
  } catch (err) { console.error('Recompute error:', err); }
}

function initControls() {
  const el = (id) => document.getElementById(id);
  const tb = el('toggleLabelsBtn'), ib = el('infoBtn'), hm = el('helpModal'), cm = el('closeModal');

  tb.addEventListener('click', () => {
    state.apiLabels = !state.apiLabels;
    tb.classList.toggle('active', state.apiLabels);
    loadMapImage();
  });
  ib.addEventListener('click', () => hm.classList.add('active'));
  cm.addEventListener('click', () => hm.classList.remove('active'));
  hm.addEventListener('click', (e) => { if (e.target === hm) hm.classList.remove('active'); });
}

function parseUrlParams() {
  const p = new URLSearchParams(window.location.search);
  if (p.has('apiLabels')) {
    state.apiLabels = p.get('apiLabels') === '1';
    const tb = document.getElementById('toggleLabelsBtn');
    if (tb) tb.classList.toggle('active', state.apiLabels);
  }
  state.pendingMarkers = {};
  const getP = (k) => {
    const v = p.get(k); if (!v) return null;
    const [x, y] = v.split(',').map(parseFloat);
    return (!isNaN(x) && !isNaN(y)) ? { x, y } : null;
  };
  state.pendingMarkers.busStart = getP('busStart');
  state.pendingMarkers.busEnd = getP('busEnd');
  state.pendingMarkers.target = getP('target');
}

function applyPendingMarkers() {
  if (!state.pendingMarkers) return;
  const pm = state.pendingMarkers;
  if (pm.busStart && pm.busEnd) createBusMarkers(pm.busStart, pm.busEnd);
  if (pm.target) createOrUpdateTarget(pm.target);
  state.pendingMarkers = null;
}

async function init() {
  try {
    parseUrlParams(); initMap(); initControls(); await loadMapImage();
    if (state.pendingMarkers) { applyPendingMarkers(); recompute(); }
  } catch (err) { console.error('Init failure:', err); }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
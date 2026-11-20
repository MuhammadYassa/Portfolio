// One sleeping, fixed-step spring system for the whole name. Positions live here,
// not in React state. All layout reads happen in measure(), never in the solver.
const STEP = 1 / 120;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function createKineticPhysics(stage, reduced) {
  const slots = [...stage.querySelectorAll(".kinetic-slot")];
  const letters = slots.map((slot, i) => ({
    slot, glyph: slot.querySelector(".kinetic-letter"), i,
    x: 0, y: 0, r: 0, s: 0, vx: 0, vy: 0, vr: 0, vs: 0,
    cx: 0, cy: 0, width: 0, height: 0, row: Number(slot.dataset.row),
    wakeAt: 0, pluckAt: 0,
  }));
  let frame = 0, previous = 0, accumulator = 0, disposed = false;
  let visible = true, dirty = true, drag = null, ink = false;
  let pointer = null;
  let stageWidth = 0;
  const touchScale = () => stageWidth < 420 ? 0.65 : 1;

  function measure() {
    stageWidth = stage.clientWidth;
    for (const letter of letters) {
      const box = letter.slot.getBoundingClientRect();
      letter.cx = box.left + box.width / 2 + window.scrollX;
      letter.cy = box.top + box.height / 2 + window.scrollY;
      letter.width = box.width;
      letter.height = box.height;
    }
    dirty = false;
  }

  function paint(letter) {
    const { x, y, r, s, glyph } = letter;
    glyph.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${r.toFixed(2)}deg) scale(${(1 - s * 0.52).toFixed(4)},${(1 + s).toFixed(4)})`;
  }

  function wake() {
    if (frame || disposed || reduced || !visible || document.hidden) return;
    previous = performance.now();
    stage.dataset.moving = "true";
    frame = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    accumulator = 0;
    pointer = null;
    if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
    drag = null;
    delete stage.dataset.grabbing;
    delete stage.dataset.moving;
    for (const letter of letters) {
      letter.x = letter.y = letter.r = letter.s = 0;
      letter.vx = letter.vy = letter.vr = letter.vs = 0;
      letter.wakeAt = letter.pluckAt = 0;
      letter.glyph.style.removeProperty("transform");
      letter.slot.removeAttribute("data-held");
    }
  }

  function solve(now) {
    const scale = touchScale();
    // Snapshot neighbors so the result does not depend on iteration direction.
    const positions = letters.map(({ x, y }) => ({ x, y }));
    let moving = false;
    for (const letter of letters) {
      if (letter.pluckAt && now >= letter.pluckAt) {
        letter.vy = -610 * scale;
        letter.vx += (letter.i % 2 ? 95 : -95) * scale;
        letter.vr = (letter.i % 2 ? 210 : -210);
        letter.vs = 2.4;
        letter.pluckAt = 0;
      }
      if (now < letter.wakeAt) { moving = true; continue; }
      let tx = 0, ty = 0, tr = 0, ts = 0;
      const held = drag?.index === letter.i;
      if (held) {
        // Rubber resistance bounds the toy, even if the pointer leaves the page.
        const dx = drag.x - drag.startX, dy = drag.y - drag.startY;
        const limit = 100 * scale;
        const left = 12 + letter.width / 2 - (letter.cx - window.scrollX);
        const right = innerWidth - 12 - letter.width / 2 - (letter.cx - window.scrollX);
        tx = clamp(Math.tanh(dx / limit) * limit, left, right);
        ty = Math.tanh(dy / (64 * scale)) * 64 * scale;
        tr = tx * 0.22;
        ts = Math.min(0.22, Math.hypot(tx, ty) / 400);
      } else if (pointer && !drag) {
        const dx = letter.cx - pointer.x, dy = letter.cy - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = 155 * scale;
        const influence = Math.max(0, 1 - distance / radius) ** 2;
        const momentum = Math.exp(-(now - pointer.time) / 110);
        const speed = Math.min(1, pointer.speed / 1200) * momentum;
        // Repel nearby letters; carry a little of the pointer's momentum.
        tx = (dx / Math.max(distance, 18) * 34 + pointer.vx * momentum * 0.012) * influence * scale;
        ty = (dy / Math.max(distance, 18) * 29 - 10 - speed * 14) * influence * scale;
        tr = (dx * 0.18 + pointer.vx * momentum * 0.008) * influence;
        ts = influence * (0.08 + speed * 0.05);
      }
      // A light elastic connection transmits a tug to adjacent letters in a word.
      let nx = 0, ny = 0;
      for (const index of [letter.i - 1, letter.i + 1]) {
        if (letters[index]?.row === letter.row) {
          nx += (positions[index].x - letter.x) * 22;
          ny += (positions[index].y - letter.y) * 22;
        }
      }
      const stiffness = held ? 520 : 190, damping = held ? 31 : 17;
      letter.vx += ((tx - letter.x) * stiffness - damping * letter.vx + nx) * STEP;
      letter.vy += ((ty - letter.y) * stiffness - damping * letter.vy + ny) * STEP;
      letter.vr += ((tr - letter.r) * 175 - 16 * letter.vr) * STEP;
      // Acceleration adds a small, connected squash/stretch on spring-back.
      const stretch = ts + clamp(-letter.vy / 2400, -0.12, 0.14);
      letter.vs += ((stretch - letter.s) * 235 - 19 * letter.vs) * STEP;
      letter.x = clamp(letter.x + letter.vx * STEP, -115 * scale, 115 * scale);
      letter.y = clamp(letter.y + letter.vy * STEP, -75 * scale, 75 * scale);
      letter.r = clamp(letter.r + letter.vr * STEP, -35, 35);
      letter.s = clamp(letter.s + letter.vs * STEP, -0.22, 0.3);
      // Include rotation/stretch in the viewport guard, including spring overshoot.
      const angle = letter.r * Math.PI / 180;
      const halfWidth = (letter.width * (1 - letter.s * 0.52) * Math.abs(Math.cos(angle)) +
        letter.height * (1 + letter.s) * Math.abs(Math.sin(angle))) / 2;
      const centerShift = 0.18 * letter.height * (1 + letter.s) * Math.sin(angle);
      const viewportCenter = letter.cx - window.scrollX + centerShift;
      letter.x = clamp(letter.x, 10 + halfWidth - viewportCenter, innerWidth - 10 - halfWidth - viewportCenter);
      if (Math.abs(letter.vx) + Math.abs(letter.vy) + Math.abs(letter.vr) +
        Math.abs(letter.vs) * 100 > 0.15 || letter.pluckAt) moving = true;
    }
    return moving;
  }

  function tick(now) {
    frame = 0;
    if (disposed) return;
    if (dirty) measure();
    accumulator += Math.min((now - previous) / 1000, 0.032);
    previous = now;
    let moving = accumulator < STEP;
    while (accumulator >= STEP) {
      moving = solve(now) || moving;
      accumulator -= STEP;
    }
    for (const letter of letters) paint(letter);
    if (moving || drag) frame = requestAnimationFrame(tick);
    else {
      if (!pointer) for (const letter of letters) {
        letter.x = letter.y = letter.r = letter.s = 0;
        letter.vx = letter.vy = letter.vr = letter.vs = 0;
        letter.glyph.style.removeProperty("transform");
      }
      delete stage.dataset.moving;
    }
  }

  function pluck(origin = 6) {
    if (reduced) {
      ink = !ink;
      stage.dataset.ink = String(ink);
      return;
    }
    if (drag) return;
    pointer = null;
    const now = performance.now();
    for (const letter of letters) {
      letter.wakeAt = 0;
      letter.pluckAt = now + Math.abs(letter.i - origin) * 42;
    }
    wake();
  }

  function move(event) {
    if (!event.isPrimary) return;
    if (drag?.id === event.pointerId) {
      drag.x = event.pageX; drag.y = event.pageY;
      drag.distance = Math.max(drag.distance, Math.hypot(drag.x - drag.startX, drag.y - drag.startY));
      wake();
    } else if (event.pointerType !== "touch") {
      const now = performance.now(), dt = Math.max(8, now - (pointer?.time ?? now));
      const vx = clamp((event.pageX - (pointer?.x ?? event.pageX)) / dt * 1000, -1800, 1800);
      const vy = clamp((event.pageY - (pointer?.y ?? event.pageY)) / dt * 1000, -1800, 1800);
      pointer = { x: event.pageX, y: event.pageY, vx, vy, speed: Math.hypot(vx, vy), time: now };
      wake();
    }
  }

  function down(event) {
    if (!event.isPrimary || event.button !== 0 || drag || reduced) return;
    const slot = event.target.closest(".kinetic-slot");
    if (!slot) return;
    if (dirty) measure();
    const index = slots.indexOf(slot);
    drag = { id: event.pointerId, index, startX: event.pageX, startY: event.pageY,
      x: event.pageX, y: event.pageY, distance: 0 };
    pointer = null;
    for (const letter of letters) letter.wakeAt = letter.pluckAt = 0;
    stage.setPointerCapture(event.pointerId);
    stage.dataset.grabbing = "true";
    slot.dataset.held = "true";
    wake();
  }

  function release(event) {
    if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.id)) return;
    const { id, index, distance } = drag;
    const cancelled = !event || event.type !== "pointerup";
    drag = null;
    delete stage.dataset.grabbing;
    letters[index].slot.removeAttribute("data-held");
    if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
    if (!cancelled && distance < 6) pluck(index);
    wake();
  }
  function leave() { pointer = null; wake(); }
  function interrupt() { release(); leave(); }
  function visibility() { if (document.hidden) reset(); }
  function resized() { dirty = true; reset(); }
  const listeners = [
    [stage, "pointermove", move], [stage, "pointerdown", down],
    [stage, "pointerup", release], [stage, "pointercancel", release],
    [stage, "lostpointercapture", release], [stage, "pointerleave", leave],
    [window, "blur", interrupt], [window, "scroll", interrupt],
    [window, "resize", resized], [document, "visibilitychange", visibility],
  ];
  if (!reduced) for (const [target, name, handler] of listeners) target.addEventListener(name, handler, { passive: true });
  const resizeObserver = new ResizeObserver(() => { dirty = true; });
  resizeObserver.observe(stage);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) reset();
  });
  intersection.observe(stage);

  // Fonts are preloaded; wait for their metrics before measuring/assembling.
  document.fonts.ready.then(() => {
    if (disposed || reduced || !visible || document.hidden) return;
    measure();
    const now = performance.now(), scale = touchScale();
    for (const letter of letters) {
      letter.x = (letter.i % 2 ? 32 : -32) * scale;
      letter.y = (letter.row ? 46 : -42) * scale;
      letter.r = letter.i % 2 ? 24 : -24;
      letter.s = -0.18;
      letter.wakeAt = now + 100 + letter.i * 38;
      paint(letter);
    }
    wake();
  });

  return { pluck, destroy() {
    disposed = true;
    reset();
    resizeObserver.disconnect(); intersection.disconnect();
    for (const [target, name, handler] of listeners) target.removeEventListener(name, handler);
    delete stage.dataset.ink;
  } };
}

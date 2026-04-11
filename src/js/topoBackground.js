export function initTopoBackground() {
  const canvas = document.getElementById('mn-topo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  // Initialize mouse coordinates far off-screen
  let mouse = { x: -2000, y: -2000 };
  let targetMouse = { x: -2000, y: -2000 };

  const spacing = 32;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    // Normalize coordinate system to use css pixels
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize(); // Initial call

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;
  });

  // Remove effect gracefully when cursor leaves the window
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      targetMouse.x = -2000;
      targetMouse.y = -2000;
    }
  });

  // Calculate warped line position based on magnetic repulsion
  function getWarpedPoint(x, y) {
    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Configurable topographic physics
    const repulsionRadius = 350;
    const maxRepulsion = 60;

    let wx = x;
    let wy = y;

    if (dist < repulsionRadius && dist > 0) {
      // Smoother force curve using exponential ease-in-out feeling
      const normalizeDist = dist / repulsionRadius;
      const force = Math.pow(1 - normalizeDist, 1); // Push intensity curve

      wx += (dx / dist) * force * maxRepulsion;
      wy += (dy / dist) * force * maxRepulsion;
    }

    return { x: wx, y: wy };
  }

  // 60fps rendering loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Lerp mouse for ultra-smooth buttery feel 
    mouse.x += (targetMouse.x - mouse.x) * 0.12;
    mouse.y += (targetMouse.y - mouse.y) * 0.12;

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Subdivide squares for high-resolution organic curves rather than jagged angles
    const segments = 4;
    const step = spacing / segments;

    // Draw vertical wave lines
    for (let x = 0; x <= width + spacing; x += spacing) {
      let isFirst = true;
      for (let y = 0; y <= height + spacing; y += step) {
        const pt = getWarpedPoint(x, y);
        if (isFirst) {
          ctx.moveTo(pt.x, pt.y);
          isFirst = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
    }

    // Draw horizontal wave lines
    for (let y = 0; y <= height + spacing; y += spacing) {
      let isFirst = true;
      for (let x = 0; x <= width + spacing; x += step) {
        const pt = getWarpedPoint(x, y);
        if (isFirst) {
          ctx.moveTo(pt.x, pt.y);
          isFirst = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
    }

    ctx.stroke();

    requestAnimationFrame(render);
  }

  // Start loop
  requestAnimationFrame(render);
}

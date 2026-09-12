const canvas = document.querySelector("#deployment-map");
const ctx = canvas.getContext("2d");
const labels = ["Strategy", "Customer", "Ops", "Data", "Agents", "Product", "Proof", "Scale"];
const colors = ["#a7f0c1", "#d9aa38", "#f7f4ed", "#80b7f2", "#ff9a76"];
let pointer = { x: 0.5, y: 0.5 };
let t = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function draw() {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  t += 0.008;

  const cx = width * (0.5 + (pointer.x - 0.5) * 0.08);
  const cy = height * (0.48 + (pointer.y - 0.5) * 0.08);
  const radius = Math.min(width, height) * 0.32;
  const points = labels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / labels.length + t;
    return {
      label,
      x: cx + Math.cos(angle) * radius * (0.86 + (i % 3) * 0.08),
      y: cy + Math.sin(angle) * radius * (0.78 + (i % 2) * 0.12),
      color: colors[i % colors.length],
    };
  });

  ctx.lineWidth = 1;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if ((i + j) % 3 !== 0) continue;
      ctx.strokeStyle = "rgba(247, 244, 237, 0.15)";
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "rgba(167, 240, 193, 0.48)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.stroke();

  points.forEach((point, i) => {
    const pulse = Math.sin(t * 4 + i) * 3;
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(244, 255, 248, 0.92)";
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillText(point.label, point.x + 14, point.y + 5);
  });

  ctx.fillStyle = "rgba(167, 240, 193, 0.12)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.36 + Math.sin(t * 3) * 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f4fff8";
  ctx.font = "900 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GRAIT", cx, cy - 4);
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(244, 255, 248, 0.62)";
  ctx.fillText("field system", cx, cy + 18);
  ctx.textAlign = "start";

  requestAnimationFrame(draw);
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
});

window.addEventListener("resize", resize);
resize();
draw();

const greetings = [
  "Hi Linh, bạn thật là điều tuyệt vời nhất mình từng gặp.",
  "Chúc mừng sinh nhật 21-08-1999!",
  "Chúc bạn luôn vui vẻ, xinh đẹp và hạnh phúc.",
  "Mong rằng mọi điều tốt đẹp sẽ đến với bạn.",
  "Hãy luôn rực rỡ như pháo hoa và hạnh phúc như hôm nay!"
];

const typewriterContainer = document.getElementById("typewriter-container");
const typewriterDiv = document.getElementById("typewriter");
const cakeContainer = document.getElementById("cake-container");

let currentLine = 0;
let charIndex = 0;

function typeLine() {
  if (currentLine >= greetings.length) {
    setTimeout(() => {
      typewriterContainer.classList.add("hidden");
      cakeContainer.classList.remove("hidden");
    }, 600);
    return;
  }
  const line = greetings[currentLine];
  let html = "";
  for (let i = 0; i < charIndex; i++) {
    html += line[i];
  }
  typewriterDiv.innerHTML = html + '<span class="cursor" style="font-weight: bold;">|</span>';
  if (charIndex < line.length) {
    charIndex++;
    setTimeout(typeLine, 36 + Math.random()*44);
  } else {
    typewriterDiv.innerHTML = html;
    currentLine++;
    charIndex = 0;
    setTimeout(typeLine, 720);
  }
}
window.addEventListener("DOMContentLoaded", typeLine);

// --- Pháo hoa ---
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomColor() {
  const colors = ["#ffb347", "#f47fff", "#40e0d0", "#ffd700", "#ff69b4", "#aaffc3", "#e7baff"];
  return colors[Math.floor(Math.random() * colors.length)];
}
class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 32 + Math.random()*16; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 2.5 + Math.random() * 2.5;
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: randomColor(),
        alpha: 1,
        radius: 2.1 + Math.random() * 2.2
      });
    }
  }
  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.vy += 0.045;
      p.alpha *= 0.96;
    });
  }
  draw(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 13;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  isDead() {
    return this.particles.every(p => p.alpha < 0.13);
  }
}
function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach(fw => {
    fw.update();
    fw.draw(ctx);
  });
  fireworks = fireworks.filter(fw => !fw.isDead());
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

function launchFirework(x, y) {
  fireworks.push(new Firework(x, y));
}

// --- Bánh sinh nhật & Tắt nến ---
const wishForm = document.getElementById("wish-form");
const wishInput = document.getElementById("wish-input");
const wishResult = document.getElementById("wish-result");
const flame = document.getElementById("flame");
const birthdaySong = document.getElementById("birthdaySong");
let candleLit = true;

wishForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!candleLit) return;
  candleLit = false;
  flame.style.display = "none";
  const wish = wishInput.value.trim();
  wishResult.innerHTML = wish ? `Điều ước của bạn: <span style="color:#ad1457">${wish}</span><br/>Chúc bạn sớm đạt được!` : "Chúc mừng sinh nhật! 🎉";
  birthdaySong.currentTime = 0;
  birthdaySong.play();
  for (let i = 0; i < 6; i++) {
    setTimeout(() =>
      launchFirework(
        window.innerWidth * (0.18 + 0.64*Math.random()),
        window.innerHeight * (0.25 + 0.26*Math.random())
      ), i*330
    );
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === "m" || e.key === "M") {
    birthdaySong.muted = !birthdaySong.muted;
    alert(birthdaySong.muted ? "Đã tắt nhạc nền!" : "Đã bật nhạc nền!");
  }
});

canvas.addEventListener('click', (e) => {
  launchFirework(e.clientX, e.clientY);
});

cakeContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains("cake") || e.target.classList.contains("layer") || e.target.classList.contains("icing")) {
    launchFirework(
      window.innerWidth/2 + (Math.random()-0.5)*120,
      window.innerHeight/2 - 100 + (Math.random()-0.5)*80
    );
  }
});

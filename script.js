/* SSSEDUTECH — Interactions */

// --- Course data ---
const COURSES = [
  {cat:"Mechanical & Design", ico:"⚙️", items:[
    "Certified Product Design","Masters in Industrial Design","Masters in Automotive Design",
    "Certified in CAE","PG Program in Hybrid Vehicle Design & Analysis","Masters in R&D Design",
    "Certified in Wiring Harness Design","Certified CAM Programmer","Masters in CAD / CAM Engineer",
    "Professional Program in BIM Engineer","Professional Program in Architectural Design",
    "Certified Structural Design & Analysis","Certified Building Design","Certified Interior Design"
  ]},
  {cat:"Programming", ico:"💻", items:[
    "Certified in Python","Masters in Python","Certified in Java","Masters in Java",
    "Certified in PHP & Laravel","Certified in WordPress","Certified in .NET Developer",
    "Masters in .NET Developer","Certified in Android App Development","Certified in Flutter App Development",
    "Certified in Web Design & Development","Masters in Web Design & Development",
    "Certified in MEAN","Certified in MERN","Certified in Software Testing","Masters in Software Testing"
  ]},
  {cat:"Data Science", ico:"📊", items:[
    "Certified in Data Science","Masters in Data Science","Certified in Data Analytics","Certified in Business Analytics"
  ]},
  {cat:"UI / UX", ico:"🎨", items:["Certified in UI/UX","Masters in UI/UX"]},
  {cat:"Cloud", ico:"☁️", items:[
    "Certified in AWS","Masters in AWS & DevOps","Certified in Azure","Masters in Azure & DevOps"
  ]},
  {cat:"Networking", ico:"🌐", items:["Certified in Networking"]},
  {cat:"Digital Marketing", ico:"📣", items:["Certified in Digital Marketing","Masters in Digital Marketing"]},
  {cat:"Agile", ico:"🔄", items:["Certified in Scrum"]},
  {cat:"Automation", ico:"🤖", items:[
    "Certified in RPA","Certified in Industrial Automation","Masters in Industrial Automation",
    "Certified in Automation","Certified in Robotics"
  ]},
  {cat:"Embedded", ico:"🔌", items:[
    "Certified in Embedded System","Masters in Embedded System","Certified in IoT","Masters in IoT",
    "Certified in PCB","Masters in PCB","VLSI"
  ]},
  {cat:"Simulation", ico:"🧪", items:["Certified in Simulation Analysis","Masters in Simulation Analysis"]},
  {cat:"Automotive Embedded", ico:"🚗", items:["Diploma in Automotive Embedded & EV"]},
  {cat:"Electronics", ico:"⚡", items:[
    "Masters in LabVIEW","Certified in E3D","Certified in SP3D","Certified in PDMS",
    "Certified in MEP","Certified in HVAC","Certified in E-CAD","Masters in E-CAD"
  ]}
];

function renderCourses(filter=""){
  const wrap = document.getElementById("courseCategories");
  const chipsEl = document.getElementById("catChips");
  const q = filter.trim().toLowerCase();
  wrap.innerHTML = "";
  let total = 0;

  COURSES.forEach((c, i) => {
    const items = q ? c.items.filter(x => x.toLowerCase().includes(q)) : c.items;
    if(!items.length) return;
    total += items.length;
    const block = document.createElement("div");
    block.className = "cat-block reveal";
    block.id = "cat-" + i;
    block.innerHTML = `
      <div class="cat-head">
        <div class="cat-ico">${c.ico}</div>
        <div class="cat-title">${c.cat}</div>
        <div class="cat-count">${items.length} programs</div>
      </div>
      <div class="course-grid">
        ${items.map(x => `
          <div class="course-card">
            <div class="cc-ico">${c.ico}</div>
            <div class="cc-name">${x}</div>
            <div class="cc-badges"><span>Placement Assistance</span><span>Industry Certificate</span></div>
            <a href="#contact" class="cc-more">Learn More</a>
          </div>`).join("")}
      </div>`;
    wrap.appendChild(block);
  });

  document.getElementById("noResults").hidden = total !== 0;

  // build chips (only once)
  if(!chipsEl.dataset.built){
    chipsEl.innerHTML = `<button data-i="all" class="active">All</button>` +
      COURSES.map((c,i)=>`<button data-i="${i}">${c.cat}</button>`).join("");
    chipsEl.dataset.built = "1";
    chipsEl.addEventListener("click", e=>{
      const b = e.target.closest("button"); if(!b) return;
      chipsEl.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      if(b.dataset.i === "all"){ window.scrollTo({top:document.getElementById("courses").offsetTop-80, behavior:"smooth"}); }
      else { document.getElementById("cat-"+b.dataset.i)?.scrollIntoView({behavior:"smooth", block:"start"}); }
    });
  }
  observeReveal();
}

// --- Loader ---
function hideLoader(){ const l=document.getElementById("loader"); if(l) l.classList.add("hide"); }
if(document.readyState === "complete"){ setTimeout(hideLoader, 500); }
else { window.addEventListener("load", () => setTimeout(hideLoader, 500)); }

// --- Navbar / mobile ---
const nav = document.getElementById("navbar");
const menu = document.getElementById("nav-menu");
const burger = document.getElementById("hamburger");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 30);
  document.getElementById("scroll-progress").style.width =
    (scrollY / (document.body.scrollHeight - innerHeight) * 100) + "%";
  document.getElementById("toTop").classList.toggle("show", scrollY > 500);
});
burger.addEventListener("click", ()=>{
  burger.classList.toggle("open");
  menu.classList.toggle("open");
  const open = menu.classList.contains("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e=>{
  if(e.target.tagName === "A"){ menu.classList.remove("open"); burger.classList.remove("open"); }
});

// --- Back to top ---
document.getElementById("toTop").addEventListener("click", ()=>scrollTo({top:0, behavior:"smooth"}));

// --- Typing ---
const words = ["Python","Java","Data Science","UI/UX","Cloud","Embedded","Automotive"];
const typEl = document.getElementById("typing");
let wi=0, ci=0, del=false;
function tick(){
  const w = words[wi];
  typEl.textContent = w.slice(0, ci);
  if(!del && ci < w.length){ ci++; setTimeout(tick, 90); }
  else if(del && ci > 0){ ci--; setTimeout(tick, 45); }
  else{
    if(!del){ del = true; setTimeout(tick, 1400); }
    else { del = false; wi = (wi+1) % words.length; setTimeout(tick, 300); }
  }
}
tick();

// --- Particles ---
(function(){
  const c = document.getElementById("particles");
  const ctx = c.getContext("2d");
  let W, H, pts;
  function resize(){
    W = c.width = c.offsetWidth * devicePixelRatio;
    H = c.height = c.offsetHeight * devicePixelRatio;
    pts = Array.from({length: Math.min(80, Math.floor(W*H/25000))}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
      r:Math.random()*2+.5
    }));
  }
  resize(); addEventListener("resize", resize);
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const p of pts){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.fillStyle = "rgba(245,179,1,.55)";
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i], b=pts[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<120*devicePixelRatio){
        ctx.strokeStyle = `rgba(245,179,1,${.15*(1-d/(120*devicePixelRatio))})`;
        ctx.lineWidth = devicePixelRatio*.5;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- Reveal animation ---
let io;
function observeReveal(){
  if(!io){
    io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }});
    }, {threshold:.12});
  }
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));
}

// --- Counters ---
const counterIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count; let cur = 0;
    const step = Math.max(1, Math.floor(end/60));
    const t = setInterval(()=>{
      cur += step;
      if(cur >= end){ cur = end; clearInterval(t); }
      el.textContent = cur.toLocaleString();
    }, 20);
    counterIO.unobserve(el);
  });
}, {threshold:.3});

// --- Testimonials ---
(function(){
  const track = document.getElementById("tTrack");
  const dots = document.getElementById("tDots");
  const n = track.children.length;
  let idx = 0;
  for(let i=0;i<n;i++){
    const b = document.createElement("button");
    b.setAttribute("aria-label","Go to testimonial "+(i+1));
    if(i===0) b.classList.add("active");
    b.addEventListener("click", ()=>go(i));
    dots.appendChild(b);
  }
  function go(i){
    idx = i;
    track.style.transform = `translateX(-${i*100}%)`;
    dots.querySelectorAll("button").forEach((d,j)=>d.classList.toggle("active", i===j));
  }
  setInterval(()=>go((idx+1)%n), 5000);
})();

// --- Ripple ---
document.addEventListener("click", e=>{
  const b = e.target.closest(".ripple");
  if(!b) return;
  const r = b.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "rp";
  const size = Math.max(r.width, r.height);
  s.style.width = s.style.height = size+"px";
  s.style.left = (e.clientX - r.left - size/2) + "px";
  s.style.top = (e.clientY - r.top - size/2) + "px";
  b.appendChild(s);
  setTimeout(()=>s.remove(), 600);
});

// --- About card mouse glow ---
document.addEventListener("mousemove", e=>{
  document.querySelectorAll(".a-card").forEach(c=>{
    const r = c.getBoundingClientRect();
    if(e.clientX < r.left-40 || e.clientX > r.right+40 || e.clientY < r.top-40 || e.clientY > r.bottom+40) return;
    c.style.setProperty("--x", (e.clientX - r.left) + "px");
    c.style.setProperty("--y", (e.clientY - r.top) + "px");
  });
});

// --- Custom cursor ---
(function(){
  const c = document.getElementById("cursor"), d = document.getElementById("cursor-dot");
  addEventListener("mousemove", e=>{
    c.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    d.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll("a, button, .course-card, .a-card, summary").forEach(el=>{
    el.addEventListener("mouseenter", ()=>c.classList.add("grow"));
    el.addEventListener("mouseleave", ()=>c.classList.remove("grow"));
  });
})();

// --- Search ---
document.getElementById("courseSearch").addEventListener("input", e=>{
  renderCourses(e.target.value);
});

// --- Init ---
renderCourses();
document.querySelectorAll("[data-count]").forEach(el=>counterIO.observe(el));
observeReveal();

/* ================= Campus & Culture carousels =================
   ADD YOUR IMAGES HERE — put files in /public/gallery/ and list them below.
   Example: { src: "gallery/classroom-1.jpg", cap: "Live Python batch" }
   Leave an array empty to show a placeholder slide.
================================================================ */
const GALLERY = [
  { title: "Classroom",images: [] },
  { title: "Placement Day", 
    images: [
      { src: "./images/s1.jpeg", cap: " " },
      { src: "./images/s2.jpeg", cap: " " },
      { src: "./images/s3.jpeg", cap: " " },
      { src: "./images/s4.jpeg", cap: " " }
    ] },
  { title: "Graduation",    images: [] },
  { title: "Hackathon",     images: [] },
  { title: "Workshop",      
    images: [
      {src: "./images/workshop1.jpeg", cap:" "},
      {src: "./images/workshop2.jpeg", cap:" "}
    ] }
];

(function buildGallery(){
  const grid = document.getElementById("galGrid");
  if(!grid) return;

  GALLERY.forEach(div => {
    const imgs = div.images && div.images.length ? div.images : null;
    const card = document.createElement("div");
    card.className = "gal-card reveal";
    card.innerHTML = `
      <div class="gc-head">
        <div class="gc-title">${div.title}</div>
        <div class="gc-count">${imgs ? imgs.length + " photos" : "Coming soon"}</div>
      </div>
      <div class="gc-viewport">
        <div class="gc-track">
          ${(imgs || [null]).map((im, i) => im
            ? `<div class="gc-slide"><img src="${im.src}" alt="${(im.cap || div.title).replace(/"/g,"&quot;")} — SSSEDUTECH Solutions" loading="lazy" decoding="async">${im.cap ? `<div class="gc-cap">${im.cap}</div>` : ""}</div>`
            : `<div class="gc-slide"><div class="gc-ph">${div.title} photos coming soon</div></div>`
          ).join("")}
        </div>
        ${imgs && imgs.length > 1 ? `
          <button class="gc-nav prev" aria-label="Previous ${div.title} image">&#10094;</button>
          <button class="gc-nav next" aria-label="Next ${div.title} image">&#10095;</button>` : ""}
      </div>
      <div class="gc-dots"></div>`;
    grid.appendChild(card);

    const track = card.querySelector(".gc-track");
    const dots  = card.querySelector(".gc-dots");
    const n = imgs ? imgs.length : 1;
    let idx = 0, timer = null;

    if(n > 1){
      for(let i = 0; i < n; i++){
        const b = document.createElement("button");
        b.setAttribute("aria-label", `${div.title} image ${i+1}`);
        if(i === 0) b.classList.add("active");
        b.addEventListener("click", () => { go(i); restart(); });
        dots.appendChild(b);
      }
    }

    function go(i){
      idx = (i + n) % n;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.querySelectorAll("button").forEach((d, j) => d.classList.toggle("active", j === idx));
    }
    function restart(){ if(n < 2) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 4200); }

    if(n > 1){
      card.querySelector(".gc-nav.prev").addEventListener("click", () => { go(idx - 1); restart(); });
      card.querySelector(".gc-nav.next").addEventListener("click", () => { go(idx + 1); restart(); });
      card.addEventListener("mouseenter", () => clearInterval(timer));
      card.addEventListener("mouseleave", restart);

      // swipe support
      let sx = 0, dx = 0, dragging = false;
      const vp = card.querySelector(".gc-viewport");
      vp.addEventListener("touchstart", e => { sx = e.touches[0].clientX; dx = 0; dragging = true; clearInterval(timer); }, {passive:true});
      vp.addEventListener("touchmove",  e => { if(dragging) dx = e.touches[0].clientX - sx; }, {passive:true});
      vp.addEventListener("touchend",   () => {
        if(dragging && Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        dragging = false; restart();
      });

      // pause when off-screen
      new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting ? restart() : clearInterval(timer));
      }, {threshold:.2}).observe(card);
    }
  });

  observeReveal();
})();

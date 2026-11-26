/* SSSEDUTECH — Student accounts, registration form, payment (UPI / credit / debit) and automatic invoice
   Loaded after courses.js (uses SITE, cart, BY_SLUG, fee helpers from there).
   Settings live in the SITE object at the top of courses.js. */
(function(){
"use strict";

const $ = id => document.getElementById(id);
const CO = SITE.company || {};
const METHODS = {
  upi:    { label: "UPI" },
  credit: { label: "Credit card" },
  debit:  { label: "Debit card" }
};
const isLocal = ["", "localhost", "127.0.0.1"].includes(location.hostname);
const useFirebase = !!(SITE.firebase && SITE.firebase.apiKey && SITE.firebase.projectId);
const testPayments = !SITE.razorpayKey && (SITE.demoPayments || isLocal);

/* ================= Storage helpers ================= */
const LS = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
async function sha256(s){
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
}
function loadScript(src){
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src));
    document.head.appendChild(s);
  });
}

/* ================= Backend: Firebase (live) or this-browser demo ================= */
let userCb = () => {};
const Backend = useFirebase ? (function(){
  let fb = null;
  const cleanUser = u => u ? { uid: u.uid, email: u.email, name: u.displayName || "" } : null;
  return {
    mode: "firebase",
    async init(){
      const base = "https://www.gstatic.com/firebasejs/10.12.2/";
      await loadScript(base + "firebase-app-compat.js");
      await Promise.all([loadScript(base + "firebase-auth-compat.js"), loadScript(base + "firebase-firestore-compat.js")]);
      firebase.initializeApp(SITE.firebase);
      fb = { auth: firebase.auth(), db: firebase.firestore() };
      await new Promise(resolve => {
        let first = true;
        fb.auth.onAuthStateChanged(u => { userCb(cleanUser(u)); if(first){ first = false; resolve(); } });
      });
    },
    async register({ name, email, phone, password }){
      const cred = await fb.auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await fb.db.collection("users").doc(cred.user.uid).set({ name, email, phone, createdAt: new Date().toISOString() }, { merge: true });
      const u = cleanUser(cred.user); u.name = name; return u;
    },
    async login(email, password){ return cleanUser((await fb.auth.signInWithEmailAndPassword(email, password)).user); },
    async logout(){ await fb.auth.signOut(); },
    async reset(email){ await fb.auth.sendPasswordResetEmail(email); },
    async getProfile(uid){ const d = await fb.db.collection("users").doc(uid).get(); return d.exists ? d.data() : {}; },
    async saveProfile(uid, data){ await fb.db.collection("users").doc(uid).set(data, { merge: true }); },
    async nextInvoiceNo(){
      const ref = fb.db.collection("counters").doc("invoice");
      return fb.db.runTransaction(async t => {
        const snap = await t.get(ref);
        const n = (snap.exists ? snap.data().seq : 0) + 1;
        t.set(ref, { seq: n });
        return n;
      });
    },
    async saveOrder(uid, o){ await fb.db.collection("users").doc(uid).collection("orders").doc(o.id).set(o); },
    async listOrders(uid){
      const q = await fb.db.collection("users").doc(uid).collection("orders").orderBy("createdAt", "desc").limit(50).get();
      return q.docs.map(d => d.data());
    }
  };
})() : {
  // Test mode: everything stays in this browser only (not for real students).
  mode: "local",
  current(){
    const key = LS.get("sss_session", null); if(!key) return null;
    const u = LS.get("sss_users", {})[key]; return u ? { uid: u.uid, email: u.email, name: u.name } : null;
  },
  async init(){ userCb(this.current()); },
  async register({ name, email, phone, password }){
    const users = LS.get("sss_users", {}), key = email.toLowerCase();
    if(users[key]) throw { code: "auth/email-already-in-use" };
    users[key] = { uid: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, email, phone, hash: await sha256(password) };
    LS.set("sss_users", users); LS.set("sss_session", key);
    LS.set("sss_profile_" + users[key].uid, { name, email, phone });
    const u = this.current(); userCb(u); return u;
  },
  async login(email, password){
    const users = LS.get("sss_users", {}), key = email.toLowerCase(), u = users[key];
    if(!u || u.hash !== await sha256(password)) throw { code: "auth/invalid-credential" };
    LS.set("sss_session", key); const cu = this.current(); userCb(cu); return cu;
  },
  async logout(){ LS.set("sss_session", null); userCb(null); },
  async reset(){ throw { code: "local/no-reset" }; },
  async getProfile(uid){ return LS.get("sss_profile_" + uid, {}); },
  async saveProfile(uid, data){ LS.set("sss_profile_" + uid, Object.assign(LS.get("sss_profile_" + uid, {}), data)); },
  async nextInvoiceNo(){ const n = LS.get("sss_invoice_seq", 0) + 1; LS.set("sss_invoice_seq", n); return n; },
  async saveOrder(uid, o){ const l = LS.get("sss_orders_" + uid, []); l.unshift(o); LS.set("sss_orders_" + uid, l); },
  async listOrders(uid){ return LS.get("sss_orders_" + uid, []); }
};

function authMessage(ex){
  const c = (ex && ex.code) || "";
  if(c === "auth/email-already-in-use") return "An account with this email already exists. Please log in.";
  if(["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-login-credentials"].includes(c)) return "Incorrect email or password.";
  if(c === "auth/weak-password") return "Choose a stronger password (at least 8 characters).";
  if(c === "auth/invalid-email") return "Enter a valid email address.";
  if(c === "auth/too-many-requests") return "Too many attempts. Please wait a few minutes and try again.";
  if(c === "auth/network-request-failed") return "Network problem. Check your connection and try again.";
  if(c === "local/no-reset") return "Password reset is not available in test mode.";
  return (ex && ex.message) || "Something went wrong. Please try again.";
}

/* ================= State ================= */
let me = null, profile = {};
let afterAuth = null;
let co = { slugs: [], plan: "full" };
let lastOrders = [];
let initError = "";

userCb = async u => {
  let p = {};
  if(u){ try{ p = await Backend.getProfile(u.uid) || {}; }catch(e){ p = {}; } }
  me = u; profile = p;
  renderAcctBtn();
};
const ready = Backend.init().catch(ex => { initError = "Student login is unavailable right now. Please try again later."; console.error(ex); });
function firstName(){ const n = (profile.name || (me && me.name) || "").trim(); return n ? n.split(/\s+/)[0] : "Account"; }
function renderAcctBtn(){ const l = $("acctLabel"), b = $("acctBtn"); if(l) l.textContent = me ? firstName() : "Login"; if(b){ const t = me ? "My account (" + firstName() + ")" : "Student login"; b.title = t; b.setAttribute("aria-label", t); b.classList.toggle("in", !!me); } }

/* ================= Modal helpers ================= */
function show(el){ if(el.hidden){ el.hidden = false; lockScroll(true); } }
function hide(el){ if(!el.hidden){ el.hidden = true; lockScroll(false); } }
const authEl = $("authModal"), acctEl = $("accountModal"), coEl = $("checkoutModal"), invEl = $("invoiceModal");

/* ================= Login / Register ================= */
function setAuthTab(tab){
  const login = tab === "login";
  $("loginForm").hidden = !login; $("registerForm").hidden = login;
  $("tabLogin").classList.toggle("active", login); $("tabRegister").classList.toggle("active", !login);
  $("authTitle").textContent = login ? "Student login" : "Student registration";
  $("lgError").textContent = ""; $("rsError").textContent = "";
  $("forgotBtn").hidden = !(login && Backend.mode === "firebase");
}
async function openAuth(tab, next, note){
  afterAuth = next || null;
  await ready;
  setAuthTab(tab || "login");
  $("authNote").textContent = initError || note || "";
  $("authMode").textContent = Backend.mode === "local" ? "Test mode: accounts are stored in this browser only. Connect Firebase in courses.js to enable real student accounts." : "";
  show(authEl);
  setTimeout(() => $(tab === "register" ? "rsName" : "lgEmail").focus(), 50);
}
function closeAuth(){ hide(authEl); afterAuth = null; }
const validEmail = e => /^\S+@\S+\.\S+$/.test(e);
const validPhone = p => /^[6-9]\d{9}$/.test(p.replace(/\D/g, "").slice(-10)) && p.replace(/\D/g, "").length >= 10;
const tenDigit = p => p.replace(/\D/g, "").slice(-10);

async function afterLogin(){
  try{ profile = await Backend.getProfile(me.uid) || profile; }catch(e){}
  renderAcctBtn();
  const next = afterAuth; closeAuth();
  toast("Welcome, " + firstName());
  if(next) next();
}
$("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("lgError"), btn = $("lgBtn"); err.textContent = "";
  const email = $("lgEmail").value.trim(), pass = $("lgPass").value;
  if(!validEmail(email)){ err.textContent = "Enter a valid email address."; return; }
  if(!pass){ err.textContent = "Enter your password."; return; }
  btn.disabled = true; btn.textContent = "Logging in…";
  try{ await Backend.login(email, pass); await waitForUser(); $("lgPass").value = ""; await afterLogin(); }
  catch(ex){ err.textContent = authMessage(ex); }
  btn.disabled = false; btn.textContent = "Login";
});
$("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("rsError"), btn = $("rsBtn"); err.textContent = "";
  const d = { name: $("rsName").value.trim(), email: $("rsEmail").value.trim(), phone: $("rsPhone").value.trim(), password: $("rsPass").value };
  if(d.name.length < 3){ err.textContent = "Enter your full name."; return; }
  if(!validEmail(d.email)){ err.textContent = "Enter a valid email address."; return; }
  if(!validPhone(d.phone)){ err.textContent = "Enter a valid 10-digit mobile number."; return; }
  if(d.password.length < 8){ err.textContent = "Password must be at least 8 characters."; return; }
  if(d.password !== $("rsPass2").value){ err.textContent = "The two passwords do not match."; return; }
  d.phone = tenDigit(d.phone);
  btn.disabled = true; btn.textContent = "Creating account…";
  try{ await Backend.register(d); await waitForUser(); $("rsPass").value = $("rsPass2").value = ""; await afterLogin(); }
  catch(ex){ err.textContent = authMessage(ex); }
  btn.disabled = false; btn.textContent = "Create account & continue";
});
$("forgotBtn").addEventListener("click", async () => {
  const err = $("lgError"), email = $("lgEmail").value.trim();
  if(!validEmail(email)){ err.textContent = "Type your email above first, then tap “Forgot password?”."; return; }
  try{ await Backend.reset(email); err.style.color = "var(--gold)"; err.textContent = "Password reset link sent. Check your inbox."; setTimeout(() => err.style.color = "", 6000); }
  catch(ex){ err.textContent = authMessage(ex); }
});
function waitForUser(){ // userCb runs asynchronously; make sure profile is loaded before continuing
  return new Promise(res => { let n = 0; (function chk(){ if((me && me.uid) || n++ > 40) res(); else setTimeout(chk, 50); })(); });
}

/* ================= Checkout (registration form + payment method) ================= */
function fyLabel(d){ const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return String(y).slice(2) + "-" + String(y + 1).slice(2); }

async function openCheckout(slugs, plan){
  co = { slugs: slugs.slice(), plan: plan || "full" };
  closeCart();
  await ready;
  if(!me){
    openAuth("register", () => openCheckout(co.slugs, co.plan), "Enter your details to create your student account and continue to payment.");
    return;
  }
  const fee = feeSum(co.slugs), gst = gstOf(fee), total = fee + gst, now = payNowOf(total, co.plan);
  $("coItems").innerHTML =
    co.slugs.map(s => `<li><span>${esc(BY_SLUG[s].name)}</span><strong>${inr(BY_SLUG[s].price)}</strong></li>`).join("") +
    `<li><span>${gstLabel}</span><strong>${inr(gst)}</strong></li>` +
    `<li class="co-sum"><span>Total fee</span><strong>${inr(total)}</strong></li>` +
    (co.plan === "part" ? `<li><span>Balance after first instalment</span><strong>${inr(total - now)}</strong></li>` : "");
  $("coTotalLabel").textContent = co.plan === "part" ? "Pay now (first instalment)" : "Pay now";
  $("coTotal").textContent = inr(now);
  $("coUser").textContent = "Logged in as " + me.email;

  const p = profile || {};
  $("rgName").value = p.name || me.name || "";
  $("rgEmail").value = me.email || p.email || "";
  $("rgPhone").value = p.phone || "";
  $("rgDob").value = p.dob || "";
  $("rgGender").value = p.gender || "";
  $("rgQual").value = p.qualification || "";
  $("rgAddress").value = p.address || "";
  $("rgCity").value = p.city || "";
  $("rgState").value = p.state || "";
  $("rgPin").value = p.pincode || "";
  $("rgMode").value = p.mode || "Classroom";
  $("rgAgree").checked = false;
  $("rgDob").max = new Date().toISOString().slice(0, 10);

  $("coForm").hidden = false; $("coDone").hidden = true; $("coError").textContent = "";
  setPayButton(false);
  $("coMode").textContent = SITE.razorpayKey
    ? "Secure payment by Razorpay. Your bill is generated automatically once the payment succeeds."
    : testPayments ? "TEST MODE: no real money is charged. A sample invoice is generated."
    : "Online payment is being set up. For now your order will be sent to our team on WhatsApp.";
  show(coEl);
  setTimeout(() => $("rgPhone").value ? $("rgDob").focus() : $("rgPhone").focus(), 50);
}
function closeCheckout(){ hide(coEl); }
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

function setPayButton(busy, text){
  const b = $("coPay"); b.disabled = !!busy;
  const now = payNowOf(totalOf(feeSum(co.slugs)), co.plan);
  b.textContent = text || (SITE.razorpayKey || testPayments ? `Pay ${inr(now)}` : "Send order on WhatsApp");
}
function selectedMethod(){ const r = document.querySelector('input[name="paymethod"]:checked'); return r ? r.value : "upi"; }

function readForm(){
  return {
    name: $("rgName").value.trim().replace(/\s+/g, " "),
    email: $("rgEmail").value.trim(),
    phone: tenDigit($("rgPhone").value),
    dob: $("rgDob").value,
    gender: $("rgGender").value,
    qualification: $("rgQual").value,
    address: $("rgAddress").value.trim(),
    city: $("rgCity").value.trim(),
    state: $("rgState").value,
    pincode: $("rgPin").value.trim(),
    mode: $("rgMode").value
  };
}
function validateForm(s){
  if(s.name.length < 3) return ["rgName", "Enter your full name."];
  if(!validPhone($("rgPhone").value)) return ["rgPhone", "Enter a valid 10-digit mobile number."];
  if(!s.dob) return ["rgDob", "Select your date of birth."];
  if(s.dob > new Date().toISOString().slice(0, 10)) return ["rgDob", "Date of birth cannot be in the future."];
  if(!s.gender) return ["rgGender", "Select your gender."];
  if(!s.qualification) return ["rgQual", "Select your highest qualification."];
  if(s.address.length < 8) return ["rgAddress", "Enter your full address."];
  if(s.city.length < 2) return ["rgCity", "Enter your city."];
  if(!s.state) return ["rgState", "Select your state."];
  if(!/^[1-9]\d{5}$/.test(s.pincode)) return ["rgPin", "Enter a valid 6-digit pincode."];
  if(!$("rgAgree").checked) return ["rgAgree", "Please confirm that the details are correct."];
  return null;
}

function loadRazorpay(){
  return new Promise((resolve, reject) => {
    if(window.Razorpay) return resolve();
    loadScript("https://checkout.razorpay.com/v1/checkout.js").then(resolve, () => reject(new Error("Could not load the payment window. Check your connection and try again.")));
  });
}

async function onPay(e){
  e.preventDefault();
  const err = $("coError"); err.textContent = "";
  if(!me){ closeCheckout(); openAuth("login", () => openCheckout(co.slugs, co.plan)); return; }
  const s = readForm(), bad = validateForm(s);
  if(bad){ err.textContent = bad[1]; $(bad[0]).focus(); return; }
  const method = selectedMethod();
  setPayButton(true, "Please wait…");

  // 1) save the registration form to the student's account
  try{ await Backend.saveProfile(me.uid, Object.assign({}, s, { registered: true, updatedAt: new Date().toISOString() })); profile = Object.assign({}, profile, s); renderAcctBtn(); }
  catch(ex){ console.error(ex); err.textContent = "Could not save your registration. Check your connection and try again."; setPayButton(false); return; }

  const fee = feeSum(co.slugs), total = totalOf(fee), now = payNowOf(total, co.plan);
  const names = co.slugs.map(x => BY_SLUG[x].name).join(", ");

  // 2) no gateway yet: preview mode or WhatsApp fallback
  if(!SITE.razorpayKey){
    if(testPayments){
      setPayButton(true, "Processing test payment…");
      await new Promise(r => setTimeout(r, 700));
      await finalize(s, method, { gateway: "test", paymentId: "TEST_" + Date.now().toString(36).toUpperCase() });
      return;
    }
    const lines = co.slugs.map(x => `• ${BY_SLUG[x].name} (${inr(BY_SLUG[x].price)})`).join("\n");
    const msg = `Hi, I want to enrol.\n${lines}\nTotal incl. GST: ${inr(total)}\nPayment plan: ${co.plan === "part" ? "Instalments, first payment " + inr(now) : "Full payment"}\nPreferred payment: ${METHODS[method].label}\nName: ${s.name}\nEmail: ${s.email}\nPhone: ${s.phone}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    $("coForm").hidden = true;
    const d = $("coDone"); d.innerHTML = `<h3>Order sent on WhatsApp</h3><p>Our team will confirm the fee and share a payment link shortly.</p><button class="btn btn-primary" data-close-checkout>Done</button>`; d.hidden = false;
    return;
  }

  // 3) Razorpay: only the chosen method (UPI, credit card or debit card) is shown
  try{
    await loadRazorpay();
    const block = method === "upi" ? { method: "upi" } : { method: "card", types: [method] };
    const rz = new Razorpay({
      key: SITE.razorpayKey,
      amount: now * 100,
      currency: "INR",
      name: SITE.brand,
      description: names.slice(0, 250),
      image: new URL("images/logo.png", location.href).href,
      prefill: { name: s.name, email: s.email, contact: s.phone },
      notes: { courses: names.slice(0, 250), plan: co.plan, total_fee_incl_gst: String(total), student_phone: s.phone, student_uid: me.uid },
      theme: { color: "#f5b301" },
      config: { display: {
        blocks: { chosen: { name: "Pay using " + METHODS[method].label, instruments: [block] } },
        sequence: ["block.chosen"],
        preferences: { show_default_blocks: false }
      } },
      modal: { ondismiss: () => setPayButton(false), confirm_close: true },
      handler: res => { finalize(s, method, { gateway: "razorpay", paymentId: res.razorpay_payment_id, gatewayOrderId: res.razorpay_order_id || "", signature: res.razorpay_signature || "" }); }
    });
    rz.on("payment.failed", r => { err.textContent = (r.error && r.error.description) || "Payment failed. Please try again."; setPayButton(false); });
    rz.open();
  }catch(ex){ err.textContent = ex.message; setPayButton(false); }
}
$("coForm").addEventListener("submit", onPay);

/* ================= After payment: build order + invoice ================= */
async function finalize(student, method, pay){
  const fee = feeSum(co.slugs), gstTotal = gstOf(fee), total = fee + gstTotal, now = payNowOf(total, co.plan);
  const intra = (student.state || "").toLowerCase() === (CO.state || "").toLowerCase();
  const gst = intra
    ? { type: "cgst_sgst", rate: Math.round(GST_RATE * 100), cgst: Math.floor(gstTotal / 2), sgst: gstTotal - Math.floor(gstTotal / 2), igst: 0, total: gstTotal }
    : { type: "igst", rate: Math.round(GST_RATE * 100), cgst: 0, sgst: 0, igst: gstTotal, total: gstTotal };
  const d = new Date();
  let invoiceNo;
  try{ const n = await Backend.nextInvoiceNo(); invoiceNo = `${CO.invoicePrefix || "INV"}/${fyLabel(d)}/${String(n).padStart(4, "0")}`; }
  catch(ex){ console.error(ex); invoiceNo = `${CO.invoicePrefix || "INV"}/${fyLabel(d)}/${String(pay.paymentId).slice(-8).toUpperCase()}`; }

  const order = {
    id: String(pay.paymentId).replace(/[^A-Za-z0-9_-]/g, "") || ("o" + Date.now()),
    invoiceNo, createdAt: d.toISOString(), status: "paid", test: pay.gateway === "test",
    student,
    items: co.slugs.map(x => ({ slug: x, name: BY_SLUG[x].name, level: LEVEL_LABEL[BY_SLUG[x].level], weeks: BY_SLUG[x].weeks, fee: BY_SLUG[x].price })),
    fee, gst, total, plan: co.plan, paidNow: now, balance: total - now,
    payment: { method, methodLabel: METHODS[method].label, gateway: pay.gateway, paymentId: pay.paymentId, gatewayOrderId: pay.gatewayOrderId || "" }
  };
  let saved = true;
  try{ await Backend.saveOrder(me.uid, order); }catch(ex){ saved = false; console.error(ex); }

  cart = cart.filter(x => !co.slugs.includes(x)); saveCart(); renderCart();
  closeCheckout();
  openInvoice(order, { fresh: true, saved });
}

/* ================= Invoice ================= */
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function inWords(n){
  const two = x => x < 20 ? ONES[x] : TENS[Math.floor(x / 10)] + (x % 10 ? " " + ONES[x % 10] : "");
  const three = x => (x >= 100 ? ONES[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " : "") : "") + (x % 100 ? two(x % 100) : "");
  n = Math.round(n); if(n === 0) return "Zero Rupees Only";
  const parts = [[Math.floor(n / 1e7), "Crore"], [Math.floor(n % 1e7 / 1e5), "Lakh"], [Math.floor(n % 1e5 / 1e3), "Thousand"], [n % 1e3, ""]];
  return parts.filter(p => p[0]).map(p => three(p[0]) + (p[1] ? " " + p[1] : "")).join(" ") + " Rupees Only";
}
const fmtDate = iso => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function invoiceDoc(o){
  const s = o.student, g = o.gst;
  const rows = o.items.map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.name)}<br><small>${esc(it.level)} · ${esc(durationText(it.weeks))}</small></td><td class="r">${esc(CO.sac || "")}</td><td class="r">${inr(it.fee)}</td></tr>`).join("");
  const taxRows = g.type === "igst"
    ? `<tr><td>IGST @ ${g.rate}%</td><td class="r">${inr(g.igst)}</td></tr>`
    : `<tr><td>CGST @ ${g.rate / 2}%</td><td class="r">${inr(g.cgst)}</td></tr><tr><td>SGST @ ${g.rate / 2}%</td><td class="r">${inr(g.sgst)}</td></tr>`;
  const title = CO.gstin ? "TAX INVOICE" : "INVOICE";
  const logo = new URL("images/logo.png", location.href).href;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${esc(o.invoiceNo)}</title>
<style>
*{box-sizing:border-box}body{font:13px/1.5 Arial,Helvetica,sans-serif;color:#111;margin:0;padding:24px;background:#fff;position:relative}
h1{font-size:22px;margin:0;letter-spacing:1px}small{color:#555}.top{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #f5b301;padding-bottom:14px;margin-bottom:16px}
.brand{display:flex;gap:12px;align-items:flex-start}.brand img{width:56px;height:56px;object-fit:contain}.brand b{font-size:16px}
.meta{text-align:right}.meta div{margin-bottom:2px}.cols{display:flex;gap:20px;margin-bottom:16px}.cols>div{flex:1;border:1px solid #ddd;border-radius:6px;padding:10px 12px}
.cols h4{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#777}
table{width:100%;border-collapse:collapse}th{background:#f5f5f5;text-align:left;font-size:12px}th,td{padding:8px 10px;border-bottom:1px solid #e5e5e5;vertical-align:top}
.r{text-align:right;white-space:nowrap}.items td:first-child{width:36px}.tot{width:55%;margin-left:auto;margin-top:12px}.tot td{padding:6px 10px}
.grand td{font-weight:700;font-size:15px;border-top:2px solid #111;border-bottom:2px solid #111}.words{margin:12px 0;font-size:12px}
.status{display:inline-block;padding:3px 10px;border-radius:99px;background:#e7f7ec;color:#157f3b;font-weight:700;font-size:11px;letter-spacing:.5px}
.foot{margin-top:22px;padding-top:10px;border-top:1px solid #ddd;font-size:11px;color:#555}
.wm{position:absolute;top:38%;left:8%;font-size:90px;font-weight:800;color:rgba(200,0,0,.12);transform:rotate(-20deg);pointer-events:none}
@media print{body{padding:0}}
</style></head><body>
${o.test ? '<div class="wm">TEST INVOICE</div>' : ""}
<div class="top">
  <div class="brand"><img src="${logo}" alt=""><div><b>${esc(CO.legalName || SITE.brand)}</b><br>${esc(CO.address || "")}<br>${CO.gstin ? "GSTIN: " + esc(CO.gstin) + "<br>" : ""}${esc(CO.email || "")} · ${esc(CO.phone || "")}<br>${esc(CO.website || "")}</div></div>
  <div class="meta"><h1>${title}</h1><div><b>No:</b> ${esc(o.invoiceNo)}</div><div><b>Date:</b> ${fmtDate(o.createdAt)}</div><div><span class="status">${o.balance > 0 ? "PART PAID" : "PAID"}</span></div></div>
</div>
<div class="cols">
  <div><h4>Billed to</h4><b>${esc(s.name)}</b><br>${esc(s.address)}<br>${esc(s.city)}, ${esc(s.state)} - ${esc(s.pincode)}<br>${esc(s.email)}<br>+91 ${esc(s.phone)}</div>
  <div><h4>Payment</h4>Method: <b>${esc(o.payment.methodLabel)}</b><br>Payment ID: ${esc(o.payment.paymentId)}<br>Mode of training: ${esc(s.mode)}<br>Place of supply: ${esc(s.state)}</div>
</div>
<table class="items"><thead><tr><th>#</th><th>Description</th><th class="r">SAC</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<table class="tot"><tbody>
<tr><td>Course fee</td><td class="r">${inr(o.fee)}</td></tr>${taxRows}
<tr class="grand"><td>Total</td><td class="r">${inr(o.total)}</td></tr>
<tr><td>Amount paid now</td><td class="r">${inr(o.paidNow)}</td></tr>
${o.balance > 0 ? `<tr><td><b>Balance due</b></td><td class="r"><b>${inr(o.balance)}</b></td></tr>` : ""}
</tbody></table>
<div class="words"><b>Amount in words:</b> ${esc(inWords(o.total))}</div>
<div class="foot">This is a computer-generated invoice and does not require a signature. Fees once paid are subject to the institute's refund policy. For any query write to ${esc(CO.email || "")}.</div>
</body></html>`;
}

let currentInvoice = null;
function openInvoice(o, opts){
  opts = opts || {};
  currentInvoice = o;
  $("invFrame").srcdoc = invoiceDoc(o);
  const b = $("invBanner");
  if(opts.fresh){
    b.hidden = false;
    b.innerHTML = `<strong>${o.test ? "Test payment successful" : "Payment successful"}.</strong> Your invoice ${esc(o.invoiceNo)} has been generated.` +
      (opts.saved === false ? " <em>We could not save it to your account, so please download it now.</em>" : " You can find it anytime under My account.");
  } else b.hidden = true;
  show(invEl);
}
function closeInvoice(){ hide(invEl); }
$("invPrint").addEventListener("click", () => {
  const f = $("invFrame");
  try{ f.contentWindow.focus(); f.contentWindow.print(); }catch(e){ toast("Could not open the print window"); }
});

/* ================= My account ================= */
async function openAccount(){
  await ready;
  if(!me){ openAuth("login", openAccount); return; }
  const p = profile || {};
  $("acctInfo").innerHTML = `<div><span>Name</span><strong>${esc(p.name || me.name || "-")}</strong></div>
    <div><span>Email</span><strong>${esc(me.email)}</strong></div>
    <div><span>Mobile</span><strong>${esc(p.phone || "-")}</strong></div>`;
  const box = $("acctOrders"); box.innerHTML = `<p class="co-note">Loading…</p>`;
  show(acctEl);
  try{
    lastOrders = await Backend.listOrders(me.uid);
    box.innerHTML = lastOrders.length ? lastOrders.map((o, i) => `
      <div class="ord">
        <div><strong>${esc(o.invoiceNo)}</strong><span>${fmtDate(o.createdAt)} · ${esc(o.items.map(x => x.name).join(", "))}</span></div>
        <div class="ord-r"><strong>${inr(o.paidNow)}</strong><button type="button" class="link-btn" data-inv="${i}">View invoice</button></div>
      </div>`).join("") : `<p class="co-note">No orders yet. Your invoices will appear here after you pay for a course.</p>`;
  }catch(ex){ console.error(ex); box.innerHTML = `<p class="co-error">Could not load your orders. Please try again.</p>`; }
}
$("logoutBtn").addEventListener("click", async () => { try{ await Backend.logout(); }catch(e){} hide(acctEl); toast("Logged out"); });

/* ================= Events ================= */
document.addEventListener("click", e => {
  const t = e.target;
  if(t.closest("[data-open-account]")){ me ? openAccount() : openAuth("login"); return; }
  const tab = t.closest("[data-auth-tab]"); if(tab){ setAuthTab(tab.dataset.authTab); return; }
  if(t.closest("[data-close-auth]")){ closeAuth(); return; }
  if(t.closest("[data-close-account]")){ hide(acctEl); return; }
  if(t.closest("[data-close-invoice]")){ closeInvoice(); return; }
  const inv = t.closest("[data-inv]");
  if(inv){ const o = lastOrders[+inv.dataset.inv]; if(o) openInvoice(o); return; }
});
// Escape closes the top-most of these windows (runs before the course-page handler)
document.addEventListener("keydown", e => {
  if(e.key !== "Escape") return;
  const order = [[invEl, closeInvoice], [authEl, closeAuth], [acctEl, () => hide(acctEl)], [coEl, closeCheckout]];
  for(const [el, fn] of order){ if(!el.hidden){ fn(); e.stopPropagation(); return; } }
}, true);

})();

// عناصر DOM
const ribbonWrap = document.getElementById('ribbon');
const ribbonBand = document.getElementById('ribbonBand');
const envelope = document.getElementById('envelope');
const openHint = document.getElementById('openHint');
const paper = document.getElementById('paper');
const paperText = document.getElementById('paperText');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');

let ribbonTorn = false;
let opened = false;

// النص (الرسالة النهائية) - من اللي اتفقنا عليه
const FULL_MESSAGE = `كل سنة وإنك بخير…
ويمكن دي أغرب معايدة في حياتي،
مش بس علشان الظروف اللي بينا…
لكن علشان دي أول مرة أقولّك "عيد ميلاد سعيد" وأنا أصلاً مش في حياتك.

بس مهما حصل…
ولا سنة من عمري عدّت بدون ما أفتكر اليوم ده.
يوم اتولدت فيه حدّ… كان وجوده بالنسبة ليا أجمل من أي عيد.

مكنتش ناوي أكتب…
ولا أرجع…
ولا أفتح أبواب كنتي إنتِ اللي قفلتيها.
بس النهاردة… الدنيا زقّتني ليكي زقّة.
وقالتلي:
"افتكر… وافتكرهالي."

فافتكرتك…
افتكرت ضحكتك اللي كانت بتغيّر يومي كله،
افتكرت كلامك، ومواقف صغيرة جدًا…
بس أثّروا فيَّ بطريقة معملهاش حدّ.

عارفة…
أنا غلطت كتير، والوجع اللي حصل بينا مش بسيط.
وانتي مشيتي… وكنت فاكر إن الوقت هيلمّ الموضوع.
بس اللي حصل العكس…
الوقت فضّل يوريني قدّ إيه وجودك كان نعمة.

النهاردة عيد ميلادك…
وأنا مش جاي أرجّع اللي راح، ولا أعمل دراما.
أنا جاي أقول الحقيقة بس…
إنك وحشتيني.

مش وحشة رجوع…
وحشة إنسانة كانت جزء من روحي،
وحشة ضحكة، وحلاوة، وتفاصيل…
مش عارف أكرهها مهما حاولت.

ويمكن تتفاجئي…
إن بعد كل الوقت ده،
لسه في كلام كتير نفسي أقوله…
ولسه في جزء مني… بيدعيلِك.

وبين كل ليلة وليلة…
كنت بلاقيكي في حلمي.
عارفة؟
الحلم كان بيرجعني لدقايق كنت فاكرها راحت.
وكنت بصحى…
وأقعد ساكت شوية،
علشان الحلم كان شبه الحقيقة…
ويمكن أحسن.

آه… وبالنهاية:
بحبّك؟
آه…
ومش هداري.
لسه جوايا نفس الحب… أهدأ… أعمق… وأوضح.

عيد ميلاد سعيد يا سماسيمو… حتى لو مش معايا. 🎂💗✨`;

// helper: try play audio (ignore errors)
function tryPlay(a){
  a.play().catch(()=>{/* autoplay blocked */});
}

// تمزيق الشريط (click)
ribbonWrap.addEventListener('click', (e) => {
  if (ribbonTorn) return;
  ribbonTorn = true;
  ribbonWrap.classList.add('torn');

  // خفيف صوت قص (WebAudio)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 520;
    g.gain.value = 0.0008;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); ctx.close(); }, 120);
  } catch(e){}

  // إظهار hint بعد شوية
  setTimeout(()=> {
    openHint.classList.add('show');
    openHint.style.display = 'block';
  }, 420);
});

// بعد فك الشريط، الضغط على الظرف يفتح الورقة
envelope.addEventListener('click', (e) => {
  if (!ribbonTorn) {
    // هز بسيط لتنبيه المستخدم
    ribbonBand.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 360 });
    return;
  }
  if (opened) return;
  opened = true;

  // شغل الموسيقى لو موجود
  tryPlay(music);

  // نأثر صوت Pop
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = 720;
    g.gain.value = 0.002;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); ctx.close(); }, 120);
  } catch(e){}

  // افتح الظرف (انتحرك الغطاء)
  envelope.classList.add('open');

  // دلوقتي نظهر الورقة بـ Fade + Slide Up
  setTimeout(()=> {
    paper.classList.add('show');
    paper.setAttribute('aria-hidden','false');
    // ابدأ typing effect
    typeText(FULL_MESSAGE, paperText, 12, () => {
      // انتهاء الكتابة — ممكن تعمل حاجة بعدين
    });
  }, 540);
});

// typing effect (simple, smooth)
function typeText(text, el, speed = 12, cb){
  el.innerHTML = '';
  let i = 0;
  function step(){
    if (i >= text.length) {
      if (cb) cb();
      return;
    }
    const ch = text[i++];
    el.innerHTML += (ch === '\n') ? '<br/>' : (ch === '<' ? '&lt;' : (ch === '>' ? '&gt;' : ch));
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
    setTimeout(step, speed + (ch === '\n' ? 60 : (ch === ' ' ? 0 : 6)));
  }
  step();
}

// music control button
musicBtn.addEventListener('click', () => {
  if (music.paused) { tryPlay(music); musicBtn.textContent = 'إيقاف الموسيقى'; }
  else { music.pause(); musicBtn.textContent = 'تشغيل الموسيقى'; }
});

// accessibility: Enter opens (بعد الشريط)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && ribbonTorn && !opened) envelope.click();
});

// small sparkle generator (subtle hearts)
(function sparkles(){
  const root = document.getElementById('sparkles');
  if(!root) return;
  function make(){
    const el = document.createElement('div');
    el.className = 's';
    el.style.position = 'absolute';
    el.style.right = (10 + Math.random()*80) + '%';
    el.style.top = (5 + Math.random()*70) + '%';
    el.style.fontSize = (10 + Math.random()*16) + 'px';
    el.style.opacity = 0.08 + Math.random()*0.18;
    el.textContent = '✨';
    root.appendChild(el);
    setTimeout(()=> el.remove(), 4200 + Math.random()*3200);
  }
  setInterval(make, 600);
})();

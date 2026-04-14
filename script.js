(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const meta = document.getElementById('meta');
  const progressEl = document.getElementById('progress');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const playPauseBtn = document.getElementById('playPause');
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const audioToggleBtn = document.getElementById('audioToggle');
  const audioEl = document.getElementById('bgAudio');

  const AUTOPLAY_MS = 20000; // 30 sekund
  let current = 0;
  let playing = true;
  let autoplayTimer = null;
  let progressTimer = null;

  // Dotlar yaratish
  slides.forEach((s,i)=>{
    const d = document.createElement('div');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function show(i){
    slides.forEach((s,idx)=> s.classList.toggle('active', idx===i));
    dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
    current = i;
    meta.textContent = `Slayd ${i+1} / ${slides.length}`;
    resetProgress();
  }

  function prev(){ show((current - 1 + slides.length) % slides.length); }
  function next(){ show((current + 1) % slides.length); }
  function goTo(i){ show(i % slides.length); pauseThenResumeIfPlaying(); }

  // Autoplay
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
    startProgress();
    playing = true;
    playPauseBtn.textContent = '⏸ Pauza';
  }

  function stopAutoplay(){
    if(autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
    stopProgress();
    playing = false;
    playPauseBtn.textContent = '▶️ Play';
  }

  function togglePlay(){ playing ? stopAutoplay() : startAutoplay(); }

  playPauseBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', ()=>{ prev(); pauseThenResumeIfPlaying(); });
  nextBtn.addEventListener('click', ()=>{ next(); pauseThenResumeIfPlaying(); });

  // Progress bar
  function startProgress(){
    stopProgress();
    progressEl.style.width = '0%';
    const start = performance.now();
    progressTimer = requestAnimationFrame(function frame(now){
      const elapsed = (now - start) % AUTOPLAY_MS;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      progressEl.style.width = pct + '%';
      progressTimer = requestAnimationFrame(frame);
    });
  }

  function stopProgress(){
    if(progressTimer){ cancelAnimationFrame(progressTimer); progressTimer = null; }
  }

  function resetProgress(){ 
    progressEl.style.width = '0%'; 
    if(playing) startProgress(); 
  }

  function pauseThenResumeIfPlaying(){
    if(playing){ stopAutoplay(); setTimeout(startAutoplay, AUTOPLAY_MS); }
  }

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight'){ next(); pauseThenResumeIfPlaying(); }
    if(e.key === 'ArrowLeft'){ prev(); pauseThenResumeIfPlaying(); }
    if(e.key === ' '){ e.preventDefault(); togglePlay(); }
  });

  // Theme toggle
  themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    themeIcon.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  });

  // Audio toggle
  audioToggleBtn.addEventListener('click', () => {
    if(audioEl.paused){
      audioEl.play();
      audioToggleBtn.textContent = '⏸️';
    } else {
      audioEl.pause();
      audioToggleBtn.textContent = '▶️';
    }
  });

  // Avval autoplayni ishga tushirish
  startAutoplay();

})();
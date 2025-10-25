// ---------- ELEMENTOS ----------
const tempSlider = document.getElementById("slider-temp");
const humSlider = document.getElementById("slider-hum");
const luxSlider = document.getElementById("slider-lux");

const valTemp = document.getElementById("val-temp");
const valHum = document.getElementById("val-hum");
const valLux = document.getElementById("val-lux");
const recoText = document.getElementById("reco-text");

// ---------- FUNCIONES DE SIMULACIÓN ----------
function actualizarDashboard() {
  const temp = parseInt(tempSlider.value);
  const hum = parseInt(humSlider.value);
  const lux = parseInt(luxSlider.value);

  valTemp.textContent = `${temp} °C`;
  valHum.textContent = `${hum} %`;
  valLux.textContent = `${lux} lux`;

  // Recomendaciones simples
  let mensaje = "";

  // Temperatura
  if (temp > 30) mensaje += "Temperatura alta. Usa ventilación natural o evita el A/C prolongado. ";
  else if (temp < 20) mensaje += "Temperatura baja. Aprovecha la luz solar y evita calefactores innecesarios. ";
  else mensaje += "Temperatura agradable. No se requiere climatización. ";

  // Humedad
  if (hum > 75) mensaje += "Alta humedad. Ventila el espacio. ";
  else if (hum < 30) mensaje += "Humedad baja. Puedes usar plantas o recipientes con agua para equilibrar. ";

  // Luz
  if (lux > 700) mensaje += "Excelente luz natural. Apaga las luces interiores para ahorrar.";
  else if (lux < 300) mensaje += "Luz baja. Usa focos LED eficientes.";

  recoText.textContent = mensaje;
}

// ---------- EVENTOS ----------
[tempSlider, humSlider, luxSlider].forEach(slider =>
  slider.addEventListener("input", actualizarDashboard)
);

// ---------- INICIALIZAR ----------
actualizarDashboard();
// --- Chatbot EnergIA ---
(() => {
  const win = document.getElementById('chat-window');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-text');
  if (!win || !form || !input) return;

  const addMsg = (text, who='bot') => {
    const wrap = document.createElement('div');
    wrap.className = `msg ${who}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = who === 'bot' ? 'IA' : 'Tú';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    if (who === 'user') wrap.appendChild(bubble), wrap.appendChild(avatar);
    else wrap.appendChild(avatar), wrap.appendChild(bubble);
    win.appendChild(wrap);
    win.scrollTop = win.scrollHeight;
  };

  const faq = [
    {k:/\b(dac|alta|tarifa)\b/i, a:'La DAC aplica cuando superas un umbral de kWh al bimestre. Evítala bajando picos: A/C moderado, ilumina con LED y apaga “vampiros” (cargadores, TV en standby). Pide revisión de hábitos por horario.'},
    {k:/\b(luz|foco|natural)\b/i, a:'Si el luxómetro está alto o hay iluminación directa, apaga focos en zonas no críticas. Prioriza ventanas y paredes claras. LED 9–12W rinde para tareas comunes.'},
    {k:/\b(temp(eratura)?|confort|ac|clima)\b/i, a:'Rango sugerido 24–26 °C con ventilación 5–10 min. Cada grado menos en A/C puede aumentar 6–8% el consumo.'},
    {k:/\bco2|CO₂|kilowatt|kwh\b/i, a:'Referencia rápida: 1 kWh evitado ≈ 0.4–0.6 kg de CO₂ (factor depende de la red). Úsalo como estimador en tus reportes.'},
    {k:/\bhum(ed|edad)\b/i, a:'Mantén 40–60%. Si supera 70%, ventila y evita sobreenfriar con A/C; el deshumidificado puede ser más eficiente.'}
  ];

  const think = (q) => {
    for (const f of faq) if (f.k.test(q)) return f.a;
    return 'Puedo ayudar con DAC, luz natural, confort térmico, humedad y CO₂ por kWh. Prueba con: “temperatura ideal para ahorrar”.';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    addMsg(q, 'user');
    input.value = '';
    setTimeout(() => addMsg(think(q), 'bot'), 200);
  });

  document.querySelectorAll('.chat-suggest .chip').forEach(ch =>
    ch.addEventListener('click', () => {
      input.value = ch.dataset.q || ch.textContent;
      form.dispatchEvent(new Event('submit'));
    })
  );

  // saludo inicial
  addMsg('Hola, soy EnergIA. Pregunta por DAC, luz natural o confort para tips rápidos.');
})();

// --- Eventos del DOM ---
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Menú Responsivo y Header Autohide ---
  const navCheckbox = document.getElementById('nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const siteHeader = document.querySelector('.site-header'); 
  let lastScrollTop = 0;

  if (navCheckbox && mainNav) {
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navCheckbox.checked = false;
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (navCheckbox && navCheckbox.checked) {
      navCheckbox.checked = false;
    }
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop && currentScroll > 100) { 
      siteHeader.classList.add('site-header--hidden');
    } else {
      siteHeader.classList.remove('site-header--hidden');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }, false);
  // --- Fin: Menú Responsivo y Header Autohide ---


  // --- Inicio: Código para animar KPIs ---
  
  const kpiSection = document.getElementById('impacto');
  let observer;

  const animateValue = (el, start, end, duration, decimals) => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      let currentValue = progress * (end - start) + start;
      
      if (decimals > 0) {
        el.textContent = currentValue.toFixed(decimals);
      } else {
        el.textContent = Math.floor(currentValue);
      }

      if (el.id === 'kpi-ahorro') el.textContent += '%';
      if (el.id === 'kpi-co2') el.textContent += ' kg';

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const startCounter = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        
        document.querySelectorAll('.kpi-num').forEach(kpi => {
          const target = +kpi.getAttribute('data-target');
          const decimals = +kpi.getAttribute('data-decimals') || 0;
          if (kpi.textContent.includes(target)) return; 
          animateValue(kpi, 0, target, 1500, decimals);
        });
        
        observer.unobserve(kpiSection); 
      }
    });
  };

  observer = new IntersectionObserver(startCounter, {
    root: null,
    threshold: 0.5 
  });

  observer.observe(kpiSection);

  // --- Fin: Código para animar KPIs ---

});

document.addEventListener('DOMContentLoaded', () => {
  // ---------- ELEMENTOS (Dashboard) ----------
  const tempSlider = document.getElementById("slider-temp");
  const humSlider = document.getElementById("slider-hum");
  const luxSlider = document.getElementById("slider-lux");

  const valTemp = document.getElementById("val-temp");
  const valHum = document.getElementById("val-hum");
  const valLux = document.getElementById("val-lux");
  const recoText = document.getElementById("reco-text");
  
  // Elementos del gráfico de tendencias
  const trendsChart = document.getElementById("trends-chart");
  const chartBars = document.querySelector('.chart-bars');
  const chartLabels = document.querySelector('.chart-labels');

  // ---------- FUNCIONES DE SIMULACIÓN (Dashboard) ----------
  function actualizarDashboard() {
    if (!tempSlider || !humSlider || !luxSlider || !valTemp || !valHum || !valLux || !recoText) {
      return;
    }

    const temp = parseInt(tempSlider.value);
    const hum = parseInt(humSlider.value);
    const lux = parseInt(luxSlider.value);

    valTemp.textContent = `${temp} °C`;
    valHum.textContent = `${hum} %`;
    valLux.textContent = `${lux} lux`;

    let recomendaciones = [];

    // Temperatura
    if (temp > 30) recomendaciones.push("🌡️ Usa ventilación natural o reduce el A/C");
    else if (temp < 20) recomendaciones.push("🌡️ Aprovecha la luz solar para calentar");

    // Humedad
    if (hum > 75) recomendaciones.push("💧 Ventila para reducir humedad");
    else if (hum < 30) recomendaciones.push("💧 Usa plantas o humedecedor");

    // Luz
    if (lux > 700) recomendaciones.push("💡 Apaga luces innecesarias");
    else if (lux < 300) recomendaciones.push("💡 Usa focos LED eficientes");

    // Si no hay recomendaciones, mostrar mensaje positivo
    if (recomendaciones.length === 0) {
      recoText.innerHTML = '<span class="status-good">✓ Condiciones óptimas detectadas</span>';
    } else {
      recoText.innerHTML = recomendaciones.join(' • ');
    }
  }

  // ---------- GRÁFICO DE TENDENCIAS ----------
  function actualizarGraficoTendencias() {
    if (!chartBars || !chartLabels) return;
    
    // Limpiar gráfico existente
    chartBars.innerHTML = '';
    chartLabels.innerHTML = '';
    
    // Generar datos de ejemplo para las últimas 12 horas
    const ahora = new Date();
    const horas = [];
    const datosTemp = [];
    const datosHum = [];
    const datosLux = [];
    
    // Generar datos aleatorios basados en los valores actuales
    const tempActual = tempSlider ? parseInt(tempSlider.value) : 25;
    const humActual = humSlider ? parseInt(humSlider.value) : 50;
    const luxActual = luxSlider ? parseInt(luxSlider.value) : 500;
    
    for (let i = 0; i < 12; i++) {
      // Hora actual - (11 - i) horas
      const hora = new Date(ahora);
      hora.setHours(hora.getHours() - (11 - i));
      
      // Formato de hora (HH:MM)
      const horaStr = hora.getHours().toString().padStart(2, '0') + ':' + 
                     hora.getMinutes().toString().padStart(2, '0');
      
      // Generar datos con variación aleatoria
      const variacion = (Math.random() - 0.5) * 0.4; // -0.2 a 0.2
      const temp = Math.max(15, Math.min(35, tempActual * (1 + (i/15) * (Math.random() - 0.5))));
      const hum = Math.max(20, Math.min(90, humActual * (1 + (i/20) * (Math.random() - 0.5))));
      const lux = Math.max(0, Math.min(1000, luxActual * (1 + (i/10) * (Math.random() - 0.5))));
      
      horas.push(horaStr);
      datosTemp.push(temp);
      datosHum.push(hum);
      datosLux.push(lux);
    }
    
    // Encontrar máximos para escalar las barras
    const maxTemp = Math.max(...datosTemp, 35);
    const maxHum = Math.max(...datosHum, 90);
    const maxLux = Math.max(...datosLux, 1000);
    
    // Crear barras del gráfico
    for (let i = 0; i < 12; i++) {
      // Crear contenedor de barras agrupadas
      const barGroup = document.createElement('div');
      barGroup.className = 'bar-group';
      barGroup.style.left = `${(i * 8.33) + 2}%`;
      
      // Crear barras individuales
      const barTemp = document.createElement('div');
      barTemp.className = 'chart-bar temp';
      barTemp.style.height = `${(datosTemp[i] / maxTemp) * 80}%`;
      barTemp.style.bottom = '30%';
      barTemp.style.left = '0%';
      barTemp.style.width = '30%';
      barTemp.title = `Temp: ${Math.round(datosTemp[i])}°C`;
      
      const barHum = document.createElement('div');
      barHum.className = 'chart-bar hum';
      barHum.style.height = `${(datosHum[i] / maxHum) * 80}%`;
      barHum.style.bottom = '30%';
      barHum.style.left = '35%';
      barHum.style.width = '30%';
      barHum.title = `Humedad: ${Math.round(datosHum[i])}%`;
      
      const barLux = document.createElement('div');
      barLux.className = 'chart-bar lux';
      barLux.style.height = `${(datosLux[i] / maxLux) * 80}%`;
      barLux.style.bottom = '30%';
      barLux.style.left = '70%';
      barLux.style.width = '30%';
      barLux.title = `Luz: ${Math.round(datosLux[i])} lux`;
      
      // Agregar barras al grupo
      barGroup.appendChild(barTemp);
      barGroup.appendChild(barHum);
      barGroup.appendChild(barLux);
      
      // Agregar etiqueta de hora
      if (i % 2 === 0) { // Mostrar etiquetas cada 2 horas
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = horas[i];
        // Ajustar la posición para que las etiquetas estén centradas debajo de los grupos de barras
        label.style.left = `${(i * 8.33) + 4}%`;
        label.style.transform = 'translateX(-50%)';
        label.style.position = 'absolute';
        chartLabels.appendChild(label);
      }
      
      chartBars.appendChild(barGroup);
    }
  }
  
  // Actualizar gráfico cuando cambien los sliders
  function actualizarDashboardConGrafico() {
    actualizarDashboard();
    actualizarGraficoTendencias();
  }

  // ---------- EVENTOS E INICIALIZACIÓN (Dashboard) ----------
  const slidersDashboard = [tempSlider, humSlider, luxSlider];

  // Comprobamos que los sliders existan antes de añadir eventos
  if (slidersDashboard.every(slider => slider !== null)) {
    slidersDashboard.forEach(slider =>
      slider.addEventListener("input", actualizarDashboardConGrafico)
    );
    // ---------- INICIALIZAR ----------
    actualizarDashboardConGrafico();
  } else if (trendsChart) {
    // Si no hay sliders pero sí el gráfico, inicializar solo el gráfico
    actualizarGraficoTendencias();
  }

  // --- Chatbot EnergIA ---
  (() => {
    const win = document.getElementById('chat-window');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-text');

    if (!win || !form || !input) return;

    const addMsg = (text, who = 'bot') => {
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
      { k: /\b(dac|alta|tarifa)\b/i, a: 'La DAC aplica cuando superas un umbral de kWh al bimestre. Evítala bajando picos: A/C moderado, ilumina con LED y apaga “vampiros” (cargadores, TV en standby). Pide revisión de hábitos por horario.' },
      { k: /\b(luz|foco|natural)\b/i, a: 'Si el luxómetro está alto o hay iluminación directa, apaga focos en zonas no críticas. Prioriza ventanas y paredes claras. LED 9–12W rinde para tareas comunes.' },
      { k: /\b(temp(eratura)?|confort|ac|clima)\b/i, a: 'Rango sugerido 24–26 °C con ventilación 5–10 min. Cada grado menos en A/C puede aumentar 6–8% el consumo.' },
      { k: /\bco2|CO₂|kilowatt|kwh\b/i, a: 'Referencia rápida: 1 kWh evitado ≈ 0.4–0.6 kg de CO₂ (factor depende de la red). Úsalo como estimador en tus reportes.' },
      { k: /\bhum(ed|edad)\b/i, a: 'Mantén 40–60%. Si supera 70%, ventila y evita sobreenfriar con A/C; el deshumidificado puede ser más eficiente.' }
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

    addMsg('Hola, soy EnergIA. Pregunta por DAC, luz natural o confort para tips rápidos.');
  })();

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

    if (siteHeader) {
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        siteHeader.classList.add('site-header--hidden');
      } else {
        siteHeader.classList.remove('site-header--hidden');
      }
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
          if (!isNaN(target)) {
            animateValue(kpi, 0, target, 1500, decimals);
          }
        });
        observer.unobserve(kpiSection);
      }
    });
  };

  if (kpiSection) {
    observer = new IntersectionObserver(startCounter, {
      root: null,
      threshold: 0.5
    });
    observer.observe(kpiSection);
  }
  // --- Fin: Código para animar KPIs ---

  // --- INICIO: Código para Calculadora de Consumo ---
  const sliders = document.querySelectorAll('.calc-slider');
  const totalKwhSpan = document.getElementById('calc-total-kwh');
  const totalCo2Span = document.getElementById('calc-total-co2');
  const tipText = document.getElementById('calc-tip-text');

  const costInput = document.getElementById('costo-kwh');
  const totalCostSpan = document.getElementById('calc-total-cost');
  const envSmartphonesSpan = document.getElementById('calc-env-smartphones');

  if (sliders.length > 0 && totalKwhSpan && totalCo2Span && tipText && costInput && totalCostSpan && envSmartphonesSpan) {

    const CO2_FACTOR = 0.423; // kg CO2 por kWh
    const SMARTPHONE_CHARGE_KWH = 0.015; // Aprox 15 Wh por carga completa

    const applianceKwh = {
      tv: 0,
      micro: 0,
      laptop: 0,
      refri: 0,
      consola: 0,
      foco: 0,
      vampiro: 0
    };

    const applianceTips = {
      tv: 'Tu TV es un consumidor notable. ¿Ves más de 4 horas al día? Considera reducir el tiempo o el brillo.',
      micro: 'El microondas gasta muchísima energía en picos cortos. Evita calentar cosas pequeñas y prefiere la estufa.',
      laptop: 'Tu laptop consume bastante. Asegúrate de que esté configurada para "suspenderse" y desenchúfala si está cargada.',
      refri: '¡El refrigerador es tu mayor consumidor base! Es inevitable, pero asegúrate de que los sellos de la puerta estén limpios y no dejes la puerta abierta.',
      consola: 'Las consolas en modo "juego" gastan casi tanto como un refrigerador. ¡No olvides apagarla por completo al terminar!',
      foco: 'Los focos LED son eficientes, pero 3 focos por 4 horas suman. Apaga las luces de las habitaciones que no estés usando.',
      vampiro: '¡El consumo "vampiro" (standby) es tu segundo mayor gasto! Conecta tus aparatos a una barra multicontacto y apágala por completo.',
      default: 'Mueve los sliders para ver el impacto de cada aparato y encontrar dónde puedes ahorrar más.'
    };

    const toggles = document.querySelectorAll('.calc-toggle');
    
    toggles.forEach(toggle => {
      const sliderId = toggle.getAttribute('data-slider-id');
      const slider = document.getElementById(sliderId);
      if (slider && !slider.disabled) { 
        slider.disabled = !toggle.checked;
      }

      toggle.addEventListener('input', () => {
        if (slider && !slider.disabled) {
          slider.disabled = !toggle.checked;
        }
        actualizarCalculadora();
      });
    });

    function actualizarCalculadora() {
      let totalKwh = 0;
      let maxKwh = 0;
      let maxAppliance = 'default';

      sliders.forEach(slider => {
        const id = slider.id.split('-')[1];
        const hours = parseFloat(slider.value);
        const watts = parseInt(slider.getAttribute('data-watts'));

        const valSpan = document.getElementById(`val-${id}`);
        if (valSpan) valSpan.textContent = `${hours.toFixed(1)} hrs`;

        const kwh = (watts * hours) / 1000;

        const infoIcon = document.getElementById(`info-${id}`);
        if (infoIcon) {
          infoIcon.setAttribute('data-tooltip', `${kwh.toFixed(3)} kWh`);
        }

        const toggle = document.getElementById(`toggle-${id}`);
        
        if (toggle && toggle.checked) {
          applianceKwh[id] = kwh;
          totalKwh += kwh;

          if (kwh > maxKwh && id !== 'refri' && id !== 'vampiro') {
            maxKwh = kwh;
            maxAppliance = id;
          }
        } else {
          applianceKwh[id] = 0;
        }
      });


      if (maxKwh === 0) {
        if (applianceKwh['refri'] > applianceKwh['vampiro']) {
          maxAppliance = 'refri';
        } else if (applianceKwh['vampiro'] > 0) {
          maxAppliance = 'vampiro';
        }
      }

      totalKwhSpan.textContent = totalKwh.toFixed(2);

      const totalCo2 = totalKwh * CO2_FACTOR;
      totalCo2Span.textContent = totalCo2.toFixed(2);

      const costoKwh = parseFloat(costInput.value) || 0;
      const totalCost = totalKwh * costoKwh;
      totalCostSpan.textContent = `$${totalCost.toFixed(2)}`;

      const totalCharges = totalKwh / SMARTPHONE_CHARGE_KWH;
      envSmartphonesSpan.textContent = totalCharges.toFixed(0);

      if (totalKwh > 0) {
        for (const id in applianceKwh) {
          const bar = document.getElementById(`bar-${id}`);
          const percentage = (applianceKwh[id] / totalKwh) * 100; 
          if (bar) {
            bar.style.width = `${percentage}%`;
            bar.setAttribute('aria-label', `${id}: ${percentage.toFixed(0)}%`);
          }
        }
      } else {
        document.querySelectorAll('.graph-bar').forEach(bar => bar.style.width = '14.2%');
      }

      tipText.textContent = applianceTips[maxAppliance] || applianceTips.default;
    }

    sliders.forEach(slider => {
      slider.addEventListener('input', actualizarCalculadora);
    });

    costInput.addEventListener('input', actualizarCalculadora);

    actualizarCalculadora();
  }
  // --- FIN: Código para Calculadora de Consumo ---
}); // <-- FIN DEL 'DOMContentLoaded'

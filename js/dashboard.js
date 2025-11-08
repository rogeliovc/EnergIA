document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const sliders = {
    temp: document.getElementById('slider-temp'),
    hum: document.getElementById('slider-hum'),
    lux: document.getElementById('slider-lux')
  };

  const values = {
    temp: document.getElementById('val-temp'),
    hum: document.getElementById('val-hum'),
    lux: document.getElementById('val-lux')
  };

  const displayValues = {
    temp: document.getElementById('temp-value'),
    hum: document.getElementById('hum-value'),
    lux: document.getElementById('lux-value')
  };

  const bars = {
    temp: document.getElementById('bar-temp'),
    hum: document.getElementById('bar-hum'),
    lux: document.getElementById('bar-luz')
  };

  const descriptions = {
    temp: document.getElementById('desc-temp'),
    hum: document.getElementById('desc-hum'),
    lux: document.getElementById('desc-lux')
  };

  const recommendationText = document.getElementById('reco-text');

  // Rangos óptimos
  const optimalRanges = {
    temp: { min: 20, max: 24 },
    hum: { min: 40, max: 60 },
    lux: { min: 300, max: 700 }
  };

  // Actualizar valores y barras
  function updateValues() {
    // Actualizar valores mostrados
    values.temp.textContent = `${sliders.temp.value}°C`;
    values.hum.textContent = `${sliders.hum.value}%`;
    values.lux.textContent = `${sliders.lux.value} lux`;

    // Actualizar valores en los controles
    displayValues.temp.textContent = `${sliders.temp.value}°C`;
    displayValues.hum.textContent = `${sliders.hum.value}%`;
    displayValues.lux.textContent = `${sliders.lux.value} lux`;

    // Actualizar barras de progreso
    updateBars();
    
    // Actualizar descripciones y estados
    updateStatus('temp', parseInt(sliders.temp.value));
    updateStatus('hum', parseInt(sliders.hum.value));
    updateStatus('lux', parseInt(sliders.lux.value));

    // Actualizar recomendación
    updateRecommendation();
  }

  // Actualizar barras de progreso
  function updateBars() {
    // Calcular porcentajes para cada valor
    const tempPercent = ((sliders.temp.value - sliders.temp.min) / (sliders.temp.max - sliders.temp.min)) * 100;
    const humPercent = ((sliders.hum.value - sliders.hum.min) / (sliders.hum.max - sliders.hum.min)) * 100;
    const luxPercent = ((sliders.lux.value - sliders.lux.min) / (sliders.lux.max - sliders.lux.min)) * 100;

    // Aplicar anchos a las barras
    bars.temp.style.width = `${tempPercent}%`;
    bars.hum.style.width = `${humPercent}%`;
    bars.lux.style.width = `${luxPercent}%`;
  }

  // Actualizar estado y descripción según el valor
  function updateStatus(type, value) {
    const card = document.querySelector(`.sensor-card[aria-label$="${type === 'lux' ? 'Luz ambiental' : type === 'temp' ? 'Temperatura ambiente' : 'Humedad relativa'}"]`);
    const statusElement = card.querySelector('.sensor-status');
    const trendElement = card.querySelector('.sensor-trend span');
    
    let status = '';
    let statusClass = '';
    let description = '';
    let trendText = '';
    let trendClass = 'stable';

    if (type === 'temp') {
      if (value < optimalRanges.temp.min) {
        status = 'Frío';
        statusClass = 'warning';
        description = 'Temperatura baja. Considera subir la temperatura.';
        trendText = 'Temperatura por debajo del rango óptimo';
        trendClass = 'down';
      } else if (value > optimalRanges.temp.max) {
        status = 'Caliente';
        statusClass = 'warning';
        description = 'Temperatura alta. Considera bajar la temperatura o ventilar.';
        trendText = 'Temperatura por encima del rango óptimo';
        trendClass = 'up';
      } else {
        status = 'Óptimo';
        statusClass = 'good';
        description = 'Rango cómodo. No se requiere ajuste de A/C.';
        trendText = 'Temperatura en rango ideal';
      }
    } 
    
    else if (type === 'hum') {
      if (value < optimalRanges.hum.min) {
        status = 'Seco';
        statusClass = 'warning';
        description = 'Humedad baja. Considera usar un humidificador.';
        trendText = 'Humedad por debajo del rango óptimo';
        trendClass = 'down';
      } else if (value > optimalRanges.hum.max) {
        status = 'Húmedo';
        statusClass = 'warning';
        description = 'Humedad alta. Considera ventilar el espacio.';
        trendText = 'Humedad por encima del rango óptimo';
        trendClass = 'up';
      } else {
        status = 'Óptimo';
        statusClass = 'good';
        description = 'Nivel de humedad ideal para el confort.';
        trendText = 'Humedad en rango ideal';
      }
    } 
    
    else if (type === 'lux') {
      if (value < optimalRanges.lux.min) {
        status = 'Oscuro';
        statusClass = 'warning';
        description = 'Poca luz. Considera encender luces adicionales.';
        trendText = 'Nivel de luz por debajo del óptimo';
        trendClass = 'down';
      } else if (value > optimalRanges.lux.max) {
        status = 'Muy iluminado';
        statusClass = 'warning';
        description = 'Luz intensa. Considera apagar luces innecesarias.';
        trendText = 'Nivel de luz por encima del óptimo';
        trendClass = 'up';
      } else {
        status = 'Óptimo';
        statusClass = 'good';
        description = 'Iluminación adecuada para actividades generales.';
        trendText = 'Nivel de luz óptimo';
      }
    }

    // Actualizar elementos del DOM
    statusElement.textContent = status;
    statusElement.className = `sensor-status ${statusClass}`;
    descriptions[type].textContent = description;
    trendElement.textContent = trendText;
    trendElement.className = `trend ${trendClass}`;
  }

  // Actualizar recomendación basada en los valores actuales
  function updateRecommendation() {
    const temp = parseInt(sliders.temp.value);
    const hum = parseInt(sliders.hum.value);
    const lux = parseInt(sliders.lux.value);
    
    let recommendation = '';
    let savings = 0;
    
    // Lógica de recomendaciones
    if (lux > optimalRanges.lux.max) {
      const excessLux = lux - optimalRanges.lux.max;
      const lightsToTurnOff = Math.ceil(excessLux / 200); // Asumiendo 200 lux por foco
      const powerSaved = lightsToTurnOff * 0.06; // 60W por foco en kW
      const hours = 4; // Horas promedio de uso
      const dailySavings = powerSaved * hours; // kWh/día
      const monthlySavings = dailySavings * 30; // kWh/mes
      const costPerKwh = 1.5; // Costo por kWh en MXN
      const monthlyCostSavings = monthlySavings * costPerKwh;
      
      savings = monthlyCostSavings;
      
      recommendation = `Luz natural alta detectada. Si apagas ${lightsToTurnOff} foco${lightsToTurnOff > 1 ? 's' : ''} de 60W por ${hours} horas, podrías ahorrar aproximadamente <strong>${dailySavings.toFixed(2)} kWh/día</strong> ($${monthlyCostSavings.toFixed(2)} MXN/mes).`;
    } 
    else if (temp > optimalRanges.temp.max) {
      const tempDiff = temp - optimalRanges.temp.max;
      const potentialSavings = (tempDiff * 0.05 * 24 * 30 * costPerKwh).toFixed(2);
      recommendation = `Temperatura alta. Ajustar el termostato a ${optimalRanges.temp.max}°C podría ahorrarte hasta $${potentialSavings} MXN al mes.`;
    }
    else if (hum > optimalRanges.hum.max) {
      recommendation = 'Humedad alta. Ventilar el espacio puede mejorar el confort y reducir el uso de deshumidificadores.';
    }
    else {
      recommendation = '¡Buen trabajo! Las condiciones ambientales están dentro de los rangos óptimos para el ahorro de energía.';
    }

    // Actualizar el texto de recomendación
    recommendationText.innerHTML = recommendation;
    
    // Actualizar ahorros si corresponde
    const savingsElements = document.querySelectorAll('.savings-value');
    if (savings > 0 && savingsElements.length > 0) {
      const yearlySavings = savings * 12;
      savingsElements[0].textContent = `$${savings.toFixed(2)}`;
      savingsElements[1].textContent = `${(yearlySavings / costPerKwh).toFixed(1)} kWh`;
    }
  }

  // Inicializar eventos
  function init() {
    // Configurar eventos para los sliders
    Object.values(sliders).forEach(slider => {
      slider.addEventListener('input', updateValues);
    });

    // Configurar eventos para los botones de la tarjeta de recomendación
    const applyBtn = document.querySelector('.recommendation-actions .btn-primary');
    const laterBtn = document.querySelector('.recommendation-actions .btn-text');
    
    if (applyBtn) {
      applyBtn.addEventListener('click', function() {
        // Aquí iría la lógica para aplicar la recomendación
        alert('Recomendación aplicada. Se han ajustado los parámetros para optimizar el consumo.');
      });
    }
    
    if (laterBtn) {
      laterBtn.addEventListener('click', function() {
        // Aquí iría la lógica para posponer la recomendación
        alert('Recuerda que puedes volver a ver las recomendaciones en cualquier momento.');
      });
    }

    // Inicializar valores
    updateValues();
  }

  // Iniciar el dashboard
  init();
});

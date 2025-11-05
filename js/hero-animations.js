// Animación de los contadores de estadísticas
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si el elemento de estadísticas existe
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  // Configuración del Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target); // Dejar de observar después de la animación
      }
    });
  }, { threshold: 0.5 });

  // Observar la sección de estadísticas
  observer.observe(statsSection);

  // Función para animar los contadores
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Velocidad de la animación en milisegundos

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText;
      const increment = target / speed;
      let current = 0;

      // Solo animar si el contador está visible
      if (counter.getBoundingClientRect().top < window.innerHeight) {
        const updateCount = () => {
          current += increment;
          
          // Si el contador ha alcanzado el objetivo
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
      } else {
        counter.innerText = target;
      }
    });
  }
});

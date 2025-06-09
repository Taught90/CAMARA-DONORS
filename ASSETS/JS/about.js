document.addEventListener('DOMContentLoaded', function() {

  
  // Animate statistics counters
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounters() {
      statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'));
          const duration = 2000; // Animation duration in ms
          const step = target / (duration / 16); // 60fps
          
          let current = 0;
          const counter = setInterval(() => {
              current += step;
              if (current >= target) {
                  clearInterval(counter);
                  stat.textContent = target.toLocaleString();
              } else {
                  stat.textContent = Math.floor(current).toLocaleString();
              }
          }, 16);
      });
  }
  
  // Only animate when stats section is in view
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateCounters();
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });
  
  const impactSection = document.querySelector('.impact-section');
  if (impactSection) {
      observer.observe(impactSection);
  }
});
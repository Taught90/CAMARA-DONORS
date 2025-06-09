document.addEventListener('DOMContentLoaded', function() {
    
    // Story carousel functionality
    const storySlides = document.querySelectorAll('.story-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.story-prev');
    const nextBtn = document.querySelector('.story-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        storySlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        storySlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % storySlides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + storySlides.length) % storySlides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-advance slides (optional)
    // setInterval(nextSlide, 5000);
    
    // Animate statistics counters
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.floor(progress * target);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count')) || 0;
                    animateCounter(stat, target);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.activities-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
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
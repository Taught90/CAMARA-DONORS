document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-bar');
  
  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Toggle body scroll when menu is open
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on a nav link
  const navItems = document.querySelectorAll('.nav-item a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 1024) {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  
  // Run on load and resize
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

function updateYear() {
  const yearElement = document.querySelector('.copyright p');
  const curentYear = new Date().getFullYear()
  if (yearElement) {
    yearElement.textContent = '@ ' + curentYear + ' Camara Education. All Rights Reserved.';
  }
}
updateYear()
document.addEventListener('DOMContentLoaded', () => {
  /*
    =================================
    Scroll Reveal Animation
    =================================
    */

  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  sections.forEach((section) => {
    section.classList.add('hidden');

    observer.observe(section);
  });

  /*
    =================================
    Smooth Navigation
    =================================
    */

  const links = document.querySelectorAll('header nav a');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const target = document.querySelector(link.getAttribute('href'));

      target.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  /*
    =================================
    Header Background Change
    =================================
    */

  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /*
    =================================
    Hero Text Animation
    =================================
    */

  const heroElements = document.querySelectorAll('.hero > *');

  heroElements.forEach((element, index) => {
    element.style.opacity = '0';

    element.style.transform = 'translateY(40px)';

    setTimeout(() => {
      element.style.transition = 'all 0.8s ease';

      element.style.opacity = '1';

      element.style.transform = 'translateY(0)';
    }, index * 150);
  });
});

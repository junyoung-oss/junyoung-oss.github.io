/* =========================
   Mobile Navigation
========================= */

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  const mobileLinks = document.querySelectorAll('.mobile-menu nav a');

  /* =========================
       Open Menu
    ========================== */

  function openMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.add('active');

    document.body.style.overflow = 'hidden';

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');

      menuToggle.setAttribute('aria-label', '메뉴 닫기');
    }
  }

  /* =========================
       Close Menu
    ========================== */

  function closeMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove('active');

    document.body.style.overflow = '';

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');

      menuToggle.setAttribute('aria-label', '메뉴 열기');
    }
  }

  /* =========================
       Toggle Menu
    ========================== */

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  /* =========================
       Close Button
    ========================== */

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', function () {
      closeMenu();
    });
  }

  /* =========================
       Navigation Link
       Click → Close Menu
    ========================== */

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  /* =========================
       ESC → Close Menu
    ========================== */

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  /* =========================
       Click Outside
    ========================== */

  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (event) {
      if (event.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  /* =========================
       Resize
       PC 화면으로 커졌을 때
       모바일 메뉴 자동 닫기
    ========================== */

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
});

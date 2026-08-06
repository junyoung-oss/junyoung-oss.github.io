document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  const navDots = document.querySelectorAll('.side-nav a');

  const animated = document.querySelectorAll(
    '.fade-up, .fade-left, .fade-right'
  );

  /*
    섹션 위치 감지
    오른쪽 가이드 점 활성화
  */

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = [...sections].indexOf(entry.target);

          navDots.forEach((dot) => {
            dot.classList.remove('active');
          });

          if (navDots[index]) {
            navDots[index].classList.add('active');
          }
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  /*
    애니메이션 처리

    중요:
    보이면 show 추가
    사라지면 show 제거

    -> 위아래 스크롤 모두 동작
  */

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  animated.forEach((el) => {
    animationObserver.observe(el);
  });

  /*
    오른쪽 점 클릭 이동
  */

  navDots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();

      sections[index].scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

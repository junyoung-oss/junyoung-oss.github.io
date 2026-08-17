// 전역 상태 변수
let excludedNumbers = new Set();
let currentDrawNo = 1237;
let maxAvailableDrawNo = 1237;
window.currentSets = [];

// 2026-08-15 기준 1237회 공식 데이터 (기본 백업용)
const fallbackDrawData = {
  returnValue: 'success',
  drwNo: 1237,
  drwNoDate: '2026-08-15',
  firstPrzwnerCo: 14,
  firstWinamnt: 1950000000,
  drwtNo1: 10,
  drwtNo2: 20,
  drwtNo3: 23,
  drwtNo4: 34,
  drwtNo5: 37,
  drwtNo6: 40,
  bnusNo: 36
};

// 공 색상 판정 함수
function getBallColorClass(num) {
  if (num <= 10) return 'c-yellow';
  if (num <= 20) return 'c-blue';
  if (num <= 30) return 'c-red';
  if (num <= 40) return 'c-gray';
  return 'c-green';
}

// 1. 현재 접속 시점 기준 최신 회차 정확 계산 (매주 토요일 20:45 기준)
function calculateAccurateLatestDrawNo() {
  // 1237회 추첨 기준 시점: 2026년 8월 15일 20시 45분 (KST)
  const baseDrawDate = new Date('2026-08-15T20:45:00+09:00').getTime();
  const now = new Date().getTime();

  if (now < baseDrawDate) {
    return 1237;
  }

  // 지난 주 수만큼 회차 증가
  const diffWeeks = Math.floor(
    (now - baseDrawDate) / (1000 * 60 * 60 * 24 * 7)
  );
  return 1237 + diffWeeks;
}

// 2. 당첨 정보 화면 UI 렌더링
function renderDrawDataToUI(data) {
  if (!data || data.returnValue !== 'success') return;

  document.getElementById('draw-round-num').textContent = data.drwNo;
  document.getElementById('draw-date-text').textContent = data.drwNoDate;
  document.getElementById('prize-winners').textContent =
    `1등 당첨자 ${data.firstPrzwnerCo || 0}명`;

  const prizeInEok = data.firstWinamnt
    ? (data.firstWinamnt / 100000000).toFixed(1)
    : 0;
  document.getElementById('prize-amount').textContent =
    `1인당 약 ${prizeInEok}억원`;

  const ballsWrap = document.getElementById('winning-balls-container');
  ballsWrap.innerHTML = '';

  for (let i = 1; i <= 6; i++) {
    const num = data[`drwtNo${i}`];
    const b = document.createElement('div');
    b.className = `lotto-ball ${getBallColorClass(num)}`;
    b.textContent = num;
    ballsWrap.appendChild(b);
  }

  const plus = document.createElement('span');
  plus.className = 'plus-sign';
  plus.textContent = '+';
  ballsWrap.appendChild(plus);

  const bonus = document.createElement('div');
  bonus.className = `lotto-ball ${getBallColorClass(data.bnusNo)}`;
  bonus.textContent = data.bnusNo;
  ballsWrap.appendChild(bonus);
}

// 3. 실시간 동행복권 API 호출 (다중 프록시 + 최신 회차 자동 탐색)
async function loadDrawData(drawNo) {
  const getUrl = (round) =>
    `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
  const proxies = [
    (round) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(getUrl(round))}`,
    (round) => `https://corsproxy.io/?${encodeURIComponent(getUrl(round))}`
  ];

  // 회차 데이터 조회 시도
  for (let proxyGenerator of proxies) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5초 타임아웃

      const res = await fetch(proxyGenerator(drawNo), {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data && data.returnValue === 'success') {
        currentDrawNo = data.drwNo;
        renderDrawDataToUI(data);
        return;
      }
    } catch (e) {
      // 프록시 실패 시 다음 프록시 시도
    }
  }

  // API 실패 시 해당 회차가 1237회라면 준비된 공식 백업 데이터 표시
  if (drawNo === 1237) {
    renderDrawDataToUI(fallbackDrawData);
  }
}

// 4. 단일 세트(6개) 번호 추첨 로직 (제외수 반영)
function generateLottoSet() {
  const hotNumbers = [1, 10, 12, 17, 20, 23, 34, 37, 40, 43].filter(
    (n) => !excludedNumbers.has(n)
  );
  const availablePool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
    (n) => !excludedNumbers.has(n)
  );

  const selected = new Set();
  while (selected.size < 6) {
    let num;
    if (hotNumbers.length > 0 && Math.random() < 0.35) {
      num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
    } else {
      num = availablePool[Math.floor(Math.random() * availablePool.length)];
    }
    selected.add(num);
  }
  return Array.from(selected).sort((a, b) => a - b);
}

// 5. 5개 조합 화면에 롤링 애니메이션으로 렌더링
function renderCombinationsWithAnimation(isAnimated = true) {
  const container = document.getElementById('combinations-container');
  container.innerHTML = '';

  const sets = Array.from({ length: 5 }, () => generateLottoSet());
  window.currentSets = sets;

  sets.forEach((set, rowIdx) => {
    const row = document.createElement('div');
    row.className = 'combo-row';

    const label = document.createElement('span');
    label.className = 'combo-label';
    label.textContent = `${rowIdx + 1}조합`;
    row.appendChild(label);

    const ballsWrap = document.createElement('div');
    ballsWrap.className = 'balls-row';

    set.forEach((finalNum, ballIdx) => {
      const ball = document.createElement('div');
      ball.className = 'lotto-ball';

      if (isAnimated) {
        ball.classList.add('rolling', 'c-gray');
        ball.textContent = '?';

        const spinInterval = setInterval(() => {
          ball.textContent = Math.floor(Math.random() * 45) + 1;
        }, 60);

        const delay = rowIdx * 80 + ballIdx * 70;
        setTimeout(() => {
          clearInterval(spinInterval);
          ball.classList.remove('rolling', 'c-gray');
          ball.className = `lotto-ball ${getBallColorClass(finalNum)} pop-in`;
          ball.textContent = finalNum;
        }, delay);
      } else {
        ball.className = `lotto-ball ${getBallColorClass(finalNum)}`;
        ball.textContent = finalNum;
      }

      ballsWrap.appendChild(ball);
    });

    row.appendChild(ballsWrap);
    container.appendChild(row);
  });
}

// 6. 셀프조합 모달 바텀시트 초기화
function initFilterModal() {
  const modal = document.getElementById('filter-modal');
  const openBtn = document.getElementById('open-filter-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const resetBtn = document.getElementById('reset-filter-btn');
  const applyBtn = document.getElementById('apply-filter-btn');
  const gridContainer = document.getElementById('number-grid');
  const countDisplay = document.getElementById('exclude-count');
  const tagDisplay = document.getElementById('filter-status-tag');

  gridContainer.innerHTML = '';
  for (let i = 1; i <= 45; i++) {
    const ball = document.createElement('div');
    ball.className = 'grid-ball';
    ball.textContent = i;

    ball.addEventListener('click', () => {
      if (excludedNumbers.has(i)) {
        excludedNumbers.delete(i);
        ball.classList.remove('excluded');
      } else {
        if (excludedNumbers.size >= 10) {
          alert('제외 번호는 최대 10개까지 지정 가능합니다.');
          return;
        }
        excludedNumbers.add(i);
        ball.classList.add('excluded');
      }
      countDisplay.textContent = excludedNumbers.size;
    });

    gridContainer.appendChild(ball);
  }

  openBtn.addEventListener('click', () => modal.classList.add('show'));
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  resetBtn.addEventListener('click', () => {
    excludedNumbers.clear();
    document
      .querySelectorAll('.grid-ball')
      .forEach((b) => b.classList.remove('excluded'));
    countDisplay.textContent = '0';
  });

  applyBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    if (excludedNumbers.size > 0) {
      tagDisplay.textContent = `제외수 ${excludedNumbers.size}개 적용 중`;
    } else {
      tagDisplay.textContent = '기본 통계 가중치';
    }
    renderCombinationsWithAnimation(true);
  });
}

// 7. 메인 실행 진입점
document.addEventListener('DOMContentLoaded', () => {
  // 1) 즉시 초기 화면 렌더링 (빈칸 방지)
  renderDrawDataToUI(fallbackDrawData);
  renderCombinationsWithAnimation(false);
  initFilterModal();

  // 2) 접속 시간 기준 최신 회차 자동 계산 및 실시간 패치
  maxAvailableDrawNo = calculateAccurateLatestDrawNo();
  currentDrawNo = maxAvailableDrawNo;
  loadDrawData(currentDrawNo);

  // 이전/다음 회차 탐색 버튼 이벤트
  document.getElementById('prev-draw-btn').addEventListener('click', () => {
    if (currentDrawNo > 1) {
      currentDrawNo--;
      loadDrawData(currentDrawNo);
    }
  });

  document.getElementById('next-draw-btn').addEventListener('click', () => {
    if (currentDrawNo < maxAvailableDrawNo) {
      currentDrawNo++;
      loadDrawData(currentDrawNo);
    }
  });

  // 번호 재생성 버튼
  document.getElementById('regenerate-btn').addEventListener('click', () => {
    renderCombinationsWithAnimation(true);
  });

  // 오늘 1조합 추천 버튼
  document.getElementById('today-lucky-btn').addEventListener('click', () => {
    renderCombinationsWithAnimation(true);
  });

  // 전체 복사 버튼
  document.getElementById('copy-all-btn').addEventListener('click', () => {
    if (!window.currentSets || window.currentSets.length === 0) return;
    const text = window.currentSets
      .map((s, i) => `${i + 1}조합: ${s.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(`[행운로또번호 추천]\n${text}`).then(() => {
      const btn = document.getElementById('copy-all-btn');
      btn.innerHTML = `<i class="ri-check-line"></i> 복사 완료!`;
      setTimeout(() => {
        btn.innerHTML = `<i class="ri-file-copy-line"></i> 번호 복사`;
      }, 1800);
    });
  });

  // 웹 공유 API
  document.getElementById('share-btn').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: '행운로또번호',
        text: '오늘의 로또 당첨 예상 번호를 확인해보세요!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  });
});

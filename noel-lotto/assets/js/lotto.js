// 전역 상태 변수
let excludedNumbers = new Set();
let currentDrawNo = 1237;
let maxAvailableDrawNo = 1237;
window.currentSets = [];

// 2026-08-15 기준 1237회 공식 기본 백업 데이터
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

// 최근 당첨 번호 로컬 캐시 (1~6개월 통계용)
const cachedDraws = new Map();
cachedDraws.set(1237, fallbackDrawData);

// 공 색상 판정
function getBallColorClass(num) {
  if (num <= 10) return 'c-yellow';
  if (num <= 20) return 'c-blue';
  if (num <= 30) return 'c-red';
  if (num <= 40) return 'c-gray';
  return 'c-green';
}

// 1. 접속 시점 기준 최신 회차 자동 계산 (토요일 20:45 기준)
function calculateAccurateLatestDrawNo() {
  const baseDrawDate = new Date('2026-08-15T20:45:00+09:00').getTime();
  const now = new Date().getTime();
  if (now < baseDrawDate) return 1237;
  const diffWeeks = Math.floor(
    (now - baseDrawDate) / (1000 * 60 * 60 * 24 * 7)
  );
  return 1237 + diffWeeks;
}

// 2. 상단 카드 UI 렌더링
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

// 3. 실시간 당첨 정보 API 호출
async function fetchDrawData(drawNo) {
  if (cachedDraws.has(drawNo)) {
    return cachedDraws.get(drawNo);
  }

  const getUrl = (round) =>
    `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
  const proxies = [
    (round) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(getUrl(round))}`,
    (round) => `https://corsproxy.io/?${encodeURIComponent(getUrl(round))}`
  ];

  for (let makeProxy of proxies) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(makeProxy(drawNo), { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data && data.returnValue === 'success') {
        cachedDraws.set(drawNo, data);
        return data;
      }
    } catch (e) {}
  }
  return null;
}

async function loadDrawData(drawNo) {
  const data = await fetchDrawData(drawNo);
  if (data) {
    currentDrawNo = data.drwNo;
    renderDrawDataToUI(data);
  } else if (drawNo === 1237) {
    renderDrawDataToUI(fallbackDrawData);
  }
}

// 4. 단일 세트(6개) 번호 추첨 로직
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

// 6. 셀프조합 모달 초기화
function initFilterModal() {
  const modal = document.getElementById('filter-modal');
  const openBtn = document.getElementById('open-filter-modal-btn');
  const closeBtn = document.getElementById('close-filter-modal-btn');
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

// 7. 역대 당첨번호 통계 팝업 (1개월~6개월)
async function renderHistoryList(weeksCount) {
  const container = document.getElementById('history-list-container');
  container.innerHTML =
    '<div style="text-align:center; padding: 20px; color:#868e96; font-size:13px;">당첨 번호 기록을 불러오는 중...</div>';

  const startRound = maxAvailableDrawNo;
  const items = [];

  for (let i = 0; i < weeksCount; i++) {
    const round = startRound - i;
    if (round < 1) break;
    items.push(round);
  }

  const htmlList = [];
  for (const round of items) {
    let data = cachedDraws.get(round);
    if (!data) {
      data = await fetchDrawData(round);
    }

    if (data && data.returnValue === 'success') {
      const ballsHtml = [1, 2, 3, 4, 5, 6]
        .map((idx) => {
          const num = data[`drwtNo${idx}`];
          return `<div class="lotto-ball sm ${getBallColorClass(num)}">${num}</div>`;
        })
        .join('');

      const bonusHtml = `<span class="plus-sign" style="font-size:11px;">+</span><div class="lotto-ball sm ${getBallColorClass(data.bnusNo)}">${data.bnusNo}</div>`;

      htmlList.push(`
        <div class="history-item">
          <div>
            <div class="history-round">${data.drwNo}회</div>
            <div class="history-date">${data.drwNoDate || ''}</div>
          </div>
          <div class="balls-row">${ballsHtml}${bonusHtml}</div>
        </div>
      `);
    } else {
      // 조회 실패 시 기본 플레이스홀더
      htmlList.push(`
        <div class="history-item">
          <div class="history-round">${round}회</div>
          <div style="font-size:12px; color:#adb5bd;">조회 대기 중</div>
        </div>
      `);
    }
  }

  container.innerHTML = htmlList.join('');
}

function initStatsModal() {
  const modal = document.getElementById('stats-modal');
  const openBtn = document.getElementById('btn-menu-stats');
  const closeBtn = document.getElementById('close-stats-modal-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');

  openBtn.addEventListener('click', () => {
    modal.classList.add('show');
    renderHistoryList(4); // 기본 1개월(4주)
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const weeks = parseInt(btn.getAttribute('data-period'), 10);
      renderHistoryList(weeks);
    });
  });
}

// 8. 로또 명당 찾기 (네이버 / 구글 지도 앱 연동 모달)
function initMapStoreModal() {
  const modal = document.getElementById('map-select-modal');
  const openBtn = document.getElementById('btn-menu-store');
  const closeBtn = document.getElementById('close-map-modal-btn');
  const naverBtn = document.getElementById('open-naver-map-btn');
  const googleBtn = document.getElementById('open-google-map-btn');

  openBtn.addEventListener('click', () => modal.classList.add('show'));
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // 네이버 지도 열기 (앱 호출 및 웹 fallback)
  naverBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    const query = encodeURIComponent('로또판매점');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const appUri = `nmap://search?query=${query}&appname=junyoung-oss.github.io`;
      const webUri = `https://m.map.naver.com/search2/search.naver?query=${query}`;

      const clickedAt = +new Date();
      window.location.href = appUri;

      setTimeout(() => {
        if (+new Date() - clickedAt < 1500) {
          window.location.href = webUri;
        }
      }, 800);
    } else {
      window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
    }
  });

  // 구글 지도 열기
  googleBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    const query = encodeURIComponent('로또 명당 판매점');
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  });
}

// 9. 메인 진입점 실행
document.addEventListener('DOMContentLoaded', () => {
  renderDrawDataToUI(fallbackDrawData);
  renderCombinationsWithAnimation(false);

  initFilterModal();
  initStatsModal();
  initMapStoreModal();

  maxAvailableDrawNo = calculateAccurateLatestDrawNo();
  currentDrawNo = maxAvailableDrawNo;
  loadDrawData(currentDrawNo);

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

  document.getElementById('regenerate-btn').addEventListener('click', () => {
    renderCombinationsWithAnimation(true);
  });

  document.getElementById('today-lucky-btn').addEventListener('click', () => {
    renderCombinationsWithAnimation(true);
  });

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
});

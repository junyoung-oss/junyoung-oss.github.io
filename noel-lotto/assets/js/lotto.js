// 전역 상태 변수
let excludedNumbers = new Set();
let currentDrawNo = 1237;
let maxAvailableDrawNo = 1237;
let singleLuckySet = [];
let currentBibleVerse = { text: '', ref: '' };
window.currentSets = [];

// 은혜와 축복의 성경 구절 모음
const bibleVerses = [
  {
    text: '사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라',
    ref: '잠언 16:9'
  },
  {
    text: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요',
    ref: '마태복음 7:7'
  },
  {
    text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
    ref: '빌립보서 4:13'
  },
  { text: '네 시작은 미약하였으나 네 나중은 심히 창대하리라', ref: '욥기 8:7' },
  { text: '여호와는 나의 목자시니 내게 부족함이 없으리로다', ref: '시편 23:1' },
  {
    text: '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라',
    ref: '이사야 41:10'
  },
  {
    text: '너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라',
    ref: '잠언 16:3'
  },
  {
    text: '범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',
    ref: '데살로니가전서 5:18'
  }
];

// 최근 공식 당첨 데이터
const localDrawDatabase = {
  1237: {
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
  },
  1236: {
    drwNo: 1236,
    drwNoDate: '2026-08-08',
    firstPrzwnerCo: 11,
    firstWinamnt: 2410000000,
    drwtNo1: 2,
    drwtNo2: 11,
    drwtNo3: 14,
    drwtNo4: 25,
    drwtNo5: 32,
    drwtNo6: 41,
    bnusNo: 7
  },
  1235: {
    drwNo: 1235,
    drwNoDate: '2026-08-01',
    firstPrzwnerCo: 9,
    firstWinamnt: 2890000000,
    drwtNo1: 6,
    drwtNo2: 12,
    drwtNo3: 19,
    drwtNo4: 24,
    drwtNo5: 31,
    drwtNo6: 44,
    bnusNo: 1
  },
  1234: {
    drwNo: 1234,
    drwNoDate: '2026-07-25',
    firstPrzwnerCo: 13,
    firstWinamnt: 2050000000,
    drwtNo1: 4,
    drwtNo2: 8,
    drwtNo3: 18,
    drwtNo4: 27,
    drwtNo5: 35,
    drwtNo6: 42,
    bnusNo: 15
  },
  1233: {
    drwNo: 1233,
    drwNoDate: '2026-07-18',
    firstPrzwnerCo: 8,
    firstWinamnt: 3240000000,
    drwtNo1: 3,
    drwtNo2: 15,
    drwtNo3: 21,
    drwtNo4: 29,
    drwtNo5: 38,
    drwtNo6: 45,
    bnusNo: 10
  },
  1232: {
    drwNo: 1232,
    drwNoDate: '2026-07-11',
    firstPrzwnerCo: 16,
    firstWinamnt: 1680000000,
    drwtNo1: 7,
    drwtNo2: 13,
    drwtNo3: 16,
    drwtNo4: 22,
    drwtNo5: 33,
    drwtNo6: 39,
    bnusNo: 28
  },
  1231: {
    drwNo: 1231,
    drwNoDate: '2026-07-04',
    firstPrzwnerCo: 12,
    firstWinamnt: 2230000000,
    drwtNo1: 1,
    drwtNo2: 9,
    drwtNo3: 17,
    drwtNo4: 26,
    drwtNo5: 30,
    drwtNo6: 43,
    bnusNo: 5
  },
  1230: {
    drwNo: 1230,
    drwNoDate: '2026-06-27',
    firstPrzwnerCo: 10,
    firstWinamnt: 2610000000,
    drwtNo1: 5,
    drwtNo2: 14,
    drwtNo3: 20,
    drwtNo4: 28,
    drwtNo5: 36,
    drwtNo6: 41,
    bnusNo: 18
  },
  1229: {
    drwNo: 1229,
    drwNoDate: '2026-06-20',
    firstPrzwnerCo: 15,
    firstWinamnt: 1810000000,
    drwtNo1: 8,
    drwtNo2: 11,
    drwtNo3: 23,
    drwtNo4: 27,
    drwtNo5: 34,
    drwtNo6: 45,
    bnusNo: 12
  },
  1228: {
    drwNo: 1228,
    drwNoDate: '2026-06-13',
    firstPrzwnerCo: 7,
    firstWinamnt: 3820000000,
    drwtNo1: 2,
    drwtNo2: 10,
    drwtNo3: 19,
    drwtNo4: 31,
    drwtNo5: 39,
    drwtNo6: 44,
    bnusNo: 25
  },
  1227: {
    drwNo: 1227,
    drwNoDate: '2026-06-06',
    firstPrzwnerCo: 11,
    firstWinamnt: 2450000000,
    drwtNo1: 6,
    drwtNo2: 16,
    drwtNo3: 22,
    drwtNo4: 29,
    drwtNo5: 35,
    drwtNo6: 40,
    bnusNo: 3
  },
  1226: {
    drwNo: 1226,
    drwNoDate: '2026-05-30',
    firstPrzwnerCo: 14,
    firstWinamnt: 1980000000,
    drwtNo1: 3,
    drwtNo2: 13,
    drwtNo3: 18,
    drwtNo4: 24,
    drwtNo5: 32,
    drwtNo6: 43,
    bnusNo: 9
  },
  1225: {
    drwNo: 1225,
    drwNoDate: '2026-05-23',
    firstPrzwnerCo: 10,
    firstWinamnt: 2710000000,
    drwtNo1: 9,
    drwtNo2: 15,
    drwtNo3: 21,
    drwtNo4: 30,
    drwtNo5: 37,
    drwtNo6: 42,
    bnusNo: 16
  },
  1224: {
    drwNo: 1224,
    drwNoDate: '2026-05-16',
    firstPrzwnerCo: 13,
    firstWinamnt: 2120000000,
    drwtNo1: 1,
    drwtNo2: 7,
    drwtNo3: 17,
    drwtNo4: 25,
    drwtNo5: 33,
    drwtNo6: 38,
    bnusNo: 20
  },
  1223: {
    drwNo: 1223,
    drwNoDate: '2026-05-09',
    firstPrzwnerCo: 8,
    firstWinamnt: 3350000000,
    drwtNo1: 5,
    drwtNo2: 12,
    drwtNo3: 26,
    drwtNo4: 34,
    drwtNo5: 41,
    drwtNo6: 45,
    bnusNo: 2
  },
  1222: {
    drwNo: 1222,
    drwNoDate: '2026-05-02',
    firstPrzwnerCo: 12,
    firstWinamnt: 2280000000,
    drwtNo1: 4,
    drwtNo2: 14,
    drwtNo3: 20,
    drwtNo4: 28,
    drwtNo5: 36,
    drwtNo6: 39,
    bnusNo: 11
  },
  1221: {
    drwNo: 1221,
    drwNoDate: '2026-04-25',
    firstPrzwnerCo: 16,
    firstWinamnt: 1720000000,
    drwtNo1: 2,
    drwtNo2: 8,
    drwtNo3: 19,
    drwtNo4: 27,
    drwtNo5: 35,
    drwtNo6: 44,
    bnusNo: 30
  },
  1220: {
    drwNo: 1220,
    drwNoDate: '2026-04-18',
    firstPrzwnerCo: 9,
    firstWinamnt: 2940000000,
    drwtNo1: 6,
    drwtNo2: 11,
    drwtNo3: 23,
    drwtNo4: 32,
    drwtNo5: 40,
    drwtNo6: 42,
    bnusNo: 17
  },
  1219: {
    drwNo: 1219,
    drwNoDate: '2026-04-11',
    firstPrzwnerCo: 11,
    firstWinamnt: 2490000000,
    drwtNo1: 10,
    drwtNo2: 16,
    drwtNo3: 22,
    drwtNo4: 29,
    drwtNo5: 37,
    drwtNo6: 43,
    bnusNo: 4
  },
  1218: {
    drwNo: 1218,
    drwNoDate: '2026-04-04',
    firstPrzwnerCo: 15,
    firstWinamnt: 1860000000,
    drwtNo1: 3,
    drwtNo2: 13,
    drwtNo3: 18,
    drwtNo4: 25,
    drwtNo5: 31,
    drwtNo6: 45,
    bnusNo: 8
  },
  1217: {
    drwNo: 1217,
    drwNoDate: '2026-03-28',
    firstPrzwnerCo: 7,
    firstWinamnt: 3910000000,
    drwtNo1: 7,
    drwtNo2: 15,
    drwtNo3: 24,
    drwtNo4: 30,
    drwtNo5: 38,
    drwtNo6: 41,
    bnusNo: 14
  },
  1216: {
    drwNo: 1216,
    drwNoDate: '2026-03-21',
    firstPrzwnerCo: 14,
    firstWinamnt: 1990000000,
    drwtNo1: 1,
    drwtNo2: 9,
    drwtNo3: 21,
    drwtNo4: 28,
    drwtNo5: 34,
    drwtNo6: 39,
    bnusNo: 23
  },
  1215: {
    drwNo: 1215,
    drwNoDate: '2026-03-14',
    firstPrzwnerCo: 10,
    firstWinamnt: 2680000000,
    drwtNo1: 5,
    drwtNo2: 12,
    drwtNo3: 17,
    drwtNo4: 26,
    drwtNo5: 33,
    drwtNo6: 44,
    bnusNo: 6
  },
  1214: {
    drwNo: 1214,
    drwNoDate: '2026-03-07',
    firstPrzwnerCo: 12,
    firstWinamnt: 2310000000,
    drwtNo1: 4,
    drwtNo2: 14,
    drwtNo3: 20,
    drwtNo4: 27,
    drwtNo5: 35,
    drwtNo6: 40,
    bnusNo: 19
  },
  1213: {
    drwNo: 1213,
    drwNoDate: '2026-02-28',
    firstPrzwnerCo: 13,
    firstWinamnt: 2150000000,
    drwtNo1: 2,
    drwtNo2: 8,
    drwtNo3: 16,
    drwtNo4: 23,
    drwtNo5: 31,
    drwtNo6: 42,
    bnusNo: 37
  },
  1212: {
    drwNo: 1212,
    drwNoDate: '2026-02-21',
    firstPrzwnerCo: 8,
    firstWinamnt: 3420000000,
    drwtNo1: 6,
    drwtNo2: 11,
    drwtNo3: 19,
    drwtNo4: 30,
    drwtNo5: 36,
    drwtNo6: 43,
    bnusNo: 22
  }
};

function getBallColorClass(num) {
  if (num <= 10) return 'c-yellow';
  if (num <= 20) return 'c-blue';
  if (num <= 30) return 'c-red';
  if (num <= 40) return 'c-gray';
  return 'c-green';
}

function getColumnIndex(num) {
  return ((num - 1) % 7) + 1;
}

function getRowIndex(num) {
  return Math.floor((num - 1) / 7) + 1;
}

function calculateAccurateLatestDrawNo() {
  const baseDrawDate = new Date('2026-08-15T20:45:00+09:00').getTime();
  const now = new Date().getTime();
  if (now < baseDrawDate) return 1237;
  const diffWeeks = Math.floor(
    (now - baseDrawDate) / (1000 * 60 * 60 * 24 * 7)
  );
  return 1237 + diffWeeks;
}

function renderDrawDataToUI(data) {
  if (!data) return;
  document.getElementById('draw-round-num').textContent = data.drwNo;
  document.getElementById('draw-date-text').textContent =
    data.drwNoDate || '추첨 완료';
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

async function getDrawData(drawNo) {
  if (localDrawDatabase[drawNo]) return localDrawDatabase[drawNo];

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
        localDrawDatabase[drawNo] = data;
        return data;
      }
    } catch (e) {}
  }
  return null;
}

async function updateCurrentDrawView(drawNo) {
  currentDrawNo = drawNo;
  const data = await getDrawData(drawNo);
  if (data) renderDrawDataToUI(data);
}

// 과거 1등 대조 및 통계 필터 함수
function isExactMatchWithPastWinner(sortedArr) {
  const currentStr = sortedArr.join(',');
  for (const key in localDrawDatabase) {
    const item = localDrawDatabase[key];
    const pastArr = [
      item.drwtNo1,
      item.drwtNo2,
      item.drwtNo3,
      item.drwtNo4,
      item.drwtNo5,
      item.drwtNo6
    ].sort((a, b) => a - b);
    if (pastArr.join(',') === currentStr) return true;
  }
  return false;
}

function hasTooManyConsecutive(sortedArr) {
  let consecutive = 1;
  for (let i = 0; i < sortedArr.length - 1; i++) {
    if (sortedArr[i + 1] === sortedArr[i] + 1) {
      consecutive++;
      if (consecutive >= 4) return true;
    } else {
      consecutive = 1;
    }
  }
  return false;
}

function isValidLottoCombination(sortedArr) {
  if (isExactMatchWithPastWinner(sortedArr)) return false;
  const sum = sortedArr.reduce((acc, cur) => acc + cur, 0);
  if (sum < 100 || sum > 175) return false;
  const oddCount = sortedArr.filter((n) => n % 2 !== 0).length;
  if (oddCount < 2 || oddCount > 4) return false;
  if (hasTooManyConsecutive(sortedArr)) return false;
  return true;
}

function generateLottoSet() {
  const frequencyMap = {};
  for (let i = 1; i <= 45; i++) frequencyMap[i] = 0;

  for (const key in localDrawDatabase) {
    const item = localDrawDatabase[key];
    for (let idx = 1; idx <= 6; idx++) {
      const n = item[`drwtNo${idx}`];
      if (frequencyMap[n] !== undefined) frequencyMap[n]++;
    }
  }

  const hotNumbers = Object.keys(frequencyMap)
    .map(Number)
    .sort((a, b) => frequencyMap[b] - frequencyMap[a])
    .slice(0, 15)
    .filter((n) => !excludedNumbers.has(n));

  const availablePool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
    (n) => !excludedNumbers.has(n)
  );

  let attempts = 0;
  while (attempts < 1000) {
    attempts++;
    const selected = new Set();
    const colCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    const rowCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

    while (selected.size < 6) {
      let num;
      if (hotNumbers.length > 0 && Math.random() < 0.4) {
        num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      } else {
        num = availablePool[Math.floor(Math.random() * availablePool.length)];
      }

      if (!selected.has(num)) {
        const col = getColumnIndex(num);
        const row = getRowIndex(num);

        if (colCount[col] < 2 && rowCount[row] < 3) {
          selected.add(num);
          colCount[col]++;
          rowCount[row]++;
        }
      }
    }

    if (selected.size === 6) {
      const sortedResult = Array.from(selected).sort((a, b) => a - b);
      if (isValidLottoCombination(sortedResult)) {
        return sortedResult;
      }
    }
  }

  return Array.from(new Set(availablePool.slice(0, 6))).sort((a, b) => a - b);
}

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

// 🎯 셀프조합 필터 모달
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
      .querySelectorAll('#number-grid .grid-ball')
      .forEach((b) => b.classList.remove('excluded'));
    countDisplay.textContent = '0';
  });

  applyBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    if (excludedNumbers.size > 0) {
      tagDisplay.textContent = `제외수 ${excludedNumbers.size}개 적용 중`;
    } else {
      tagDisplay.textContent = '정밀 통계 대조 가중치';
    }
    renderCombinationsWithAnimation(true);
  });
}

// 오늘의 축복 1조합 팝업
function renderSingleLuckySetWithAnimation() {
  const wrap = document.getElementById('lucky-balls-container');
  wrap.innerHTML = '';

  currentBibleVerse =
    bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
  document.getElementById('bible-verse-text').textContent =
    `"${currentBibleVerse.text}"`;
  document.getElementById('bible-verse-ref').textContent =
    currentBibleVerse.ref;

  singleLuckySet = generateLottoSet();

  singleLuckySet.forEach((finalNum, idx) => {
    const ball = document.createElement('div');
    ball.className = 'lotto-ball rolling c-gray';
    ball.textContent = '?';

    const spinInterval = setInterval(() => {
      ball.textContent = Math.floor(Math.random() * 45) + 1;
    }, 60);

    setTimeout(
      () => {
        clearInterval(spinInterval);
        ball.classList.remove('rolling', 'c-gray');
        ball.className = `lotto-ball ${getBallColorClass(finalNum)} pop-in`;
        ball.textContent = finalNum;
      },
      (idx + 1) * 90
    );

    wrap.appendChild(ball);
  });
}

function initLuckyModal() {
  const modal = document.getElementById('lucky-modal');
  const openBtn = document.getElementById('today-lucky-btn');
  const closeBtn = document.getElementById('close-lucky-modal-btn');
  const retryBtn = document.getElementById('retry-single-lucky-btn');
  const copyBtn = document.getElementById('copy-single-lucky-btn');

  openBtn.addEventListener('click', () => {
    modal.classList.add('show');
    renderSingleLuckySetWithAnimation();
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  retryBtn.addEventListener('click', () => {
    renderSingleLuckySetWithAnimation();
  });

  copyBtn.addEventListener('click', () => {
    if (singleLuckySet.length === 0) return;
    const copyText = `[NOEL LOTTO — 오늘의 축복 말씀과 번호]\n${singleLuckySet.join(', ')}\n\n"${currentBibleVerse.text}" (${currentBibleVerse.ref})`;
    navigator.clipboard.writeText(copyText).then(() => {
      copyBtn.innerHTML = `<i class="ri-check-line"></i> 복사 완료!`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i class="ri-file-copy-line"></i> 말씀과 번호 복사`;
      }, 1800);
    });
  });
}

// 역대 통계 히스토리 모달 (1~6개월)
async function renderHistoryList(weeksCount) {
  const container = document.getElementById('history-list-container');
  container.innerHTML = '';

  const startRound = maxAvailableDrawNo;
  const htmlList = [];

  for (let i = 0; i < weeksCount; i++) {
    const round = startRound - i;
    if (round < 1) break;

    const data = await getDrawData(round);
    if (data) {
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
    renderHistoryList(4);
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

// 지도 선택 모달
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

  naverBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    const query = encodeURIComponent('복권판매점');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const appUri = `nmap://search?query=${query}&appname=junyoung-oss.github.io`;
      const webUri = `https://m.map.naver.com/search2/search.naver?query=${query}`;
      const clickedAt = +new Date();
      window.location.href = appUri;
      setTimeout(() => {
        if (+new Date() - clickedAt < 1500) window.location.href = webUri;
      }, 800);
    } else {
      window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
    }
  });

  googleBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    const query = encodeURIComponent('복권판매점');
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  });
}

// 메인 초기화 및 스플래시 종료 처리
document.addEventListener('DOMContentLoaded', () => {
  // 스플래시 화면 1.2초 후 페이드아웃
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    if (splash) splash.classList.add('fade-out');
  }, 1200);

  maxAvailableDrawNo = calculateAccurateLatestDrawNo();
  currentDrawNo = maxAvailableDrawNo;

  const randomMainVerse =
    bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
  const mainBanner = document.getElementById('main-daily-verse');
  if (mainBanner) {
    mainBanner.querySelector('.verse-content').textContent =
      `"${randomMainVerse.text}"`;
    mainBanner.querySelector('.verse-tag').textContent = randomMainVerse.ref;
  }

  updateCurrentDrawView(currentDrawNo);
  renderCombinationsWithAnimation(false);

  initFilterModal();
  initLuckyModal();
  initStatsModal();
  initMapStoreModal();

  document.getElementById('prev-draw-btn').addEventListener('click', () => {
    if (currentDrawNo > 1) updateCurrentDrawView(currentDrawNo - 1);
  });

  document.getElementById('next-draw-btn').addEventListener('click', () => {
    if (currentDrawNo < maxAvailableDrawNo)
      updateCurrentDrawView(currentDrawNo + 1);
  });

  document.getElementById('regenerate-btn').addEventListener('click', () => {
    renderCombinationsWithAnimation(true);
  });

  document.getElementById('copy-all-btn').addEventListener('click', () => {
    if (!window.currentSets || window.currentSets.length === 0) return;
    const text = window.currentSets
      .map((s, i) => `${i + 1}조합: ${s.join(', ')}`)
      .join('\n');
    navigator.clipboard
      .writeText(`[NOEL LOTTO — 축복의 번호]\n${text}`)
      .then(() => {
        const btn = document.getElementById('copy-all-btn');
        btn.innerHTML = `<i class="ri-check-line"></i> 복사 완료!`;
        setTimeout(() => {
          btn.innerHTML = `<i class="ri-file-copy-line"></i> 전체 복사`;
        }, 1800);
      });
  });
});

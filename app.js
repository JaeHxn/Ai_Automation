const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const INITIAL_MESSAGE = "이름과 생년월일 입력 후 \"오늘 길돈 운세 계산\"을 누르세요.";

const nameInput = document.getElementById("nameInput");
const dobInput = document.getElementById("dobInput");
const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");
const todayText = document.getElementById("todayText");

const amountText = document.getElementById("amountText");
const nameText = document.getElementById("nameText");
const hoursText = document.getElementById("hoursText");
const auraText = document.getElementById("auraText");
const benefactorText = document.getElementById("benefactorText");
const cautionBenefactorText = document.getElementById("cautionBenefactorText");
const luckyColorChip = document.getElementById("luckyColorChip");
const luckyColorText = document.getElementById("luckyColorText");
const badColorChip = document.getElementById("badColorChip");
const badColorText = document.getElementById("badColorText");
const ruleText = document.getElementById("ruleText");
const missionText = document.getElementById("missionText");
const noteText = document.getElementById("noteText");
const typeNameText = document.getElementById("typeNameText");
const typeCommentText = document.getElementById("typeCommentText");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const copyUrlBtn = document.getElementById("copyUrlBtn");
const shareStatusText = document.getElementById("shareStatusText");
const calendarText = document.getElementById("calendarText");
const calendarGrid = document.getElementById("calendarGrid");
const resultPanel = document.querySelector(".result");

const SHARE_DEFAULT_MESSAGE = "결과 계산 후 이미지 다운로드 또는 URL 복사를 바로 사용할 수 있습니다.";
const CALENDAR_DEFAULT_MESSAGE = "결과 계산 후 오늘 기준 앞/뒤 7일 미리보기가 표시됩니다.";
const DAY_MILLISECONDS = 86400000;
const SHARE_URL = "https://ai-automation-djq.pages.dev/";

let latestResult = null;

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setShareStatus(message, kind) {
  setText(shareStatusText, message);
  if (!shareStatusText) {
    return;
  }
  shareStatusText.classList.remove("status-success", "status-error");
  if (kind === "success") {
    shareStatusText.classList.add("status-success");
  } else if (kind === "error") {
    shareStatusText.classList.add("status-error");
  }
}

function setShareButtonState(isLoading) {
  if (downloadCardBtn) {
    downloadCardBtn.disabled = isLoading;
    downloadCardBtn.textContent = isLoading ? "이미지 생성 중..." : "이미지 다운로드";
  }

  if (copyUrlBtn) {
    copyUrlBtn.disabled = isLoading;
  }
}

function triggerResultPop() {
  if (!resultPanel) {
    return;
  }
  resultPanel.classList.remove("result-pop");
  void resultPanel.offsetWidth;
  resultPanel.classList.add("result-pop");
}

const krw = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const SURNAME_WEIGHTS = [
  { value: "김", weight: 216 },
  { value: "이", weight: 147 },
  { value: "박", weight: 84 },
  { value: "최", weight: 47 },
  { value: "정", weight: 43 },
  { value: "강", weight: 24 },
  { value: "조", weight: 22 },
  { value: "윤", weight: 21 },
  { value: "장", weight: 20 },
  { value: "임", weight: 19 },
  { value: "한", weight: 18 },
  { value: "오", weight: 17 },
  { value: "서", weight: 16 },
  { value: "신", weight: 15 },
  { value: "권", weight: 14 },
  { value: "황", weight: 12 },
  { value: "안", weight: 11 },
  { value: "송", weight: 10 },
  { value: "전", weight: 10 },
  { value: "홍", weight: 9 },
  { value: "유", weight: 8 },
  { value: "고", weight: 8 },
  { value: "문", weight: 7 },
  { value: "양", weight: 7 },
  { value: "손", weight: 7 },
  { value: "배", weight: 6 },
  { value: "백", weight: 6 },
  { value: "허", weight: 6 },
  { value: "남", weight: 6 },
  { value: "심", weight: 5 },
  { value: "노", weight: 5 },
  { value: "하", weight: 5 },
  { value: "곽", weight: 5 },
  { value: "성", weight: 5 },
  { value: "차", weight: 5 },
  { value: "주", weight: 5 },
  { value: "우", weight: 4 },
  { value: "구", weight: 4 },
  { value: "민", weight: 4 },
  { value: "류", weight: 4 },
  { value: "진", weight: 4 },
  { value: "지", weight: 3 },
  { value: "엄", weight: 3 },
  { value: "채", weight: 3 },
  { value: "원", weight: 3 },
  { value: "천", weight: 3 },
  { value: "방", weight: 2 },
  { value: "공", weight: 2 },
  { value: "현", weight: 2 },
  { value: "함", weight: 2 },
  { value: "변", weight: 2 },
  { value: "염", weight: 2 },
  { value: "여", weight: 2 },
  { value: "추", weight: 2 },
  { value: "도", weight: 2 },
  { value: "소", weight: 2 },
  { value: "석", weight: 2 },
  { value: "선", weight: 2 },
  { value: "설", weight: 1 },
  { value: "마", weight: 1 },
  { value: "길", weight: 1 },
  { value: "표", weight: 1 },
  { value: "왕", weight: 1 },
  { value: "위", weight: 1 },
  { value: "육", weight: 1 },
  { value: "은", weight: 1 },
  { value: "제", weight: 1 },
];

const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const GIVEN_FIRST_SYLLABLES = [
  "가", "강", "건", "경", "고", "규", "기", "나", "노", "누",
  "다", "도", "동", "두", "라", "로", "루", "리", "마", "민",
  "명", "모", "무", "미", "바", "보", "부", "빈", "사", "서",
  "선", "성", "소", "수", "시", "아", "안", "애", "연", "영",
  "예", "오", "우", "원", "유", "윤", "은", "이", "자", "재",
  "정", "주", "준", "지", "진", "차", "채", "태", "하", "현",
  "혜", "호", "훈", "희",
];

const GIVEN_SECOND_SYLLABLES = [
  "경", "규", "근", "기", "나", "남", "도", "라", "랑", "려",
  "루", "리", "림", "민", "별", "빈", "서", "선", "성", "소",
  "수", "승", "시", "아", "안", "애", "연", "영", "예", "오",
  "온", "우", "원", "유", "윤", "율", "은", "이", "재", "정",
  "주", "준", "지", "진", "찬", "채", "태", "현", "형", "혜",
  "호", "화", "훈", "희",
];

const MISSION_TIME_SLOTS = [
  "출근 전에",
  "아침 식사 후",
  "오전 업무 시작 전에",
  "점심 주문 전에",
  "점심 식사 후",
  "오후 커피 사기 전에",
  "오후 3시 전에",
  "퇴근 30분 전에",
  "퇴근길에",
  "집 도착 후",
  "저녁 먹기 전에",
  "저녁 식사 후",
  "샤워 전에",
  "잠들기 전에",
  "오늘 마지막 결제 전에",
  "지금 당장",
];

const MISSION_ACTION_PLANS = [
  "지갑 속 영수증 3장을 정리하고 오늘 남은 예산을 메모장에 적기",
  "배달앱 장바구니를 비우고 꼭 필요한 메뉴 1개만 다시 담기",
  "카페/편의점 결제 전에 쿠폰함을 열어 사용 가능한 쿠폰 1장 적용하기",
  "자동결제 목록을 열어 이번 주 해지 후보 1개 표시해 두기",
  "계좌 이체 내역에서 소액 반복결제 1건을 확인하고 필요 여부 판단하기",
  "중고로 팔 수 있는 물건 1개를 사진 찍고 판매 메모 작성하기",
  "교통비 절약을 위해 오늘 이동 경로를 한 번에 묶어 동선 줄이기",
  "오늘 사용 가능한 포인트가 있는지 확인하고 바로 결제에 적용하기",
  "냉장고 재고를 확인해 내일 장보기 목록에서 중복 품목 1개 삭제하기",
  "오늘 결제한 내역 3건을 확인해 충동구매 1건에 표시해 두기",
  "통신/구독/멤버십 중 잘 안 쓰는 서비스 1개 해지 알림 설정하기",
  "저축 계좌로 소액(1,000원~5,000원) 이체를 한 번 실행하기",
  "내일 쓸 카드 한도를 정하고 메모로 지출 상한선 남기기",
  "앱테크 포인트 만료일을 확인하고 오늘 쓸 수 있는 포인트 먼저 사용하기",
  "외식 대신 집에 있는 재료로 대체 가능한 메뉴 1끼 정하기",
  "다음 결제 전에 10초 멈춤 규칙을 적용해 필요 여부 다시 확인하기",
  "온라인 쇼핑 찜 목록에서 오늘 안 살 항목 2개를 삭제하기",
  "가계부 앱에 오늘 지출 카테고리 1개만 정확히 기록하기",
  "은행 앱에서 무료 이체 조건을 확인하고 수수료 없는 방식으로 이체하기",
  "할인카드 혜택을 확인하고 내일 사용할 카드 1장 미리 지정하기",
];

const POSITIVE_COLOR_PREFIX = ["에메랄드", "민트", "세이지", "포레스트", "라임", "올리브", "그린티", "비리디언", "터콰이즈", "모스", "제이드", "클로버"];
const POSITIVE_COLOR_SUFFIX = ["플로우", "실크", "브리즈", "코어", "라이트", "톤", "미스트", "글로우", "딥", "펄스"];
const NEGATIVE_COLOR_PREFIX = ["버건디", "크림슨", "스칼렛", "와인", "브릭", "루비", "칠리", "마룬", "로즈우드", "가넷", "카민", "체리"];
const NEGATIVE_COLOR_SUFFIX = ["쉐이드", "딥", "스모그", "노이즈", "트랩", "베일", "블러", "폴", "터치", "브레이크"];

const FORTUNE_TYPES = {
  SAVER: {
    name: "절약형",
    comment: "큰 한 번보다 작은 기회를 챙길 때 돈운이 살아납니다.",
  },
  TURNAROUND: {
    name: "역전형",
    comment: "초반보다 후반 흐름이 강합니다. 놓쳐도 다시 기회가 옵니다.",
  },
  JACKPOT: {
    name: "한방형",
    comment: "찬스 수는 적지만 한 번 잡으면 금액이 크게 뛰는 날입니다.",
  },
  STABLE: {
    name: "안정형",
    comment: "확률과 금액 균형이 좋습니다. 꾸준한 탐색이 유리합니다.",
  },
  RISK_ALERT: {
    name: "리스크주의형",
    comment: "허탕 확률이 높습니다. 지출 관리와 보수적 행동이 유리합니다.",
  },
};

function parseKstDateParts() {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year").value);
  const month = Number(parts.find((part) => part.type === "month").value);
  const day = Number(parts.find((part) => part.type === "day").value);

  return { year, month, day };
}

function getKstTodayInfo() {
  const { year, month, day } = parseKstDateParts();
  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const dayName = DAY_NAMES[dayOfWeek];

  const startOfYear = Date.UTC(year, 0, 1);
  const todayUtc = Date.UTC(year, month - 1, day);
  const dayOfYear = Math.floor((todayUtc - startOfYear) / 86400000) + 1;

  return { dateKey, dayName, dayOfWeek, dayOfYear };
}

function parseDateKeyToUtc(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function buildDateInfoFromUtc(utcDateValue) {
  const utcDate = new Date(utcDateValue);
  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth() + 1;
  const day = utcDate.getUTCDate();
  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const dayOfWeek = utcDate.getUTCDay();
  const dayName = DAY_NAMES[dayOfWeek];
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - startOfYear) / DAY_MILLISECONDS) + 1;

  return { dateKey, dayName, dayOfWeek, dayOfYear };
}

function shortDateLabel(dateKey) {
  const [, month, day] = dateKey.split("-");
  return `${month}.${day}`;
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, "").toLowerCase();
}

function normalizeDisplayName(name) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "사용자";
  }
  return trimmedName.length > 10 ? `${trimmedName.slice(0, 10)}…` : trimmedName;
}

function hashFNV1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createSeededRng(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6d2b79f5;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(items, random) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let point = random() * totalWeight;

  for (const item of items) {
    point -= item.weight;
    if (point <= 0) {
      return item.value;
    }
  }
  return items[items.length - 1].value;
}

function pickFrom(items, random) {
  const index = Math.floor(random() * items.length);
  return items[index];
}

function toHexChannel(channelValue) {
  const clamped = Math.max(0, Math.min(255, Math.round(channelValue)));
  return clamped.toString(16).padStart(2, "0");
}

function hslToHex(hueValue, saturationValue, lightnessValue) {
  const hue = ((hueValue % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, saturationValue)) / 100;
  const lightness = Math.max(0, Math.min(100, lightnessValue)) / 100;

  const chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = lightness - (chroma / 2);

  let redPrime = 0;
  let greenPrime = 0;
  let bluePrime = 0;

  if (segment >= 0 && segment < 1) {
    redPrime = chroma;
    greenPrime = secondary;
  } else if (segment >= 1 && segment < 2) {
    redPrime = secondary;
    greenPrime = chroma;
  } else if (segment >= 2 && segment < 3) {
    greenPrime = chroma;
    bluePrime = secondary;
  } else if (segment >= 3 && segment < 4) {
    greenPrime = secondary;
    bluePrime = chroma;
  } else if (segment >= 4 && segment < 5) {
    redPrime = secondary;
    bluePrime = chroma;
  } else {
    redPrime = chroma;
    bluePrime = secondary;
  }

  const red = (redPrime + match) * 255;
  const green = (greenPrime + match) * 255;
  const blue = (bluePrime + match) * 255;

  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
}

function toChoseong(text) {
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) {
        return char;
      }
      return CHOSEONG[Math.floor(code / 588)];
    })
    .join("");
}

function buildBenefactor(seed) {
  const random = createSeededRng(seed);
  const surname = pickWeighted(SURNAME_WEIGHTS, random);
  const first = pickFrom(GIVEN_FIRST_SYLLABLES, random);
  let second = pickFrom(GIVEN_SECOND_SYLLABLES, random);
  let retry = 0;
  while (first === second && retry < 5) {
    second = pickFrom(GIVEN_SECOND_SYLLABLES, random);
    retry += 1;
  }

  const fullName = `${surname}${first}${second}`;
  return {
    fullName,
    initials: toChoseong(fullName),
  };
}

function buildMission(seed) {
  const random = createSeededRng(seed);
  const timeSlot = pickFrom(MISSION_TIME_SLOTS, random);
  const actionPlan = pickFrom(MISSION_ACTION_PLANS, random);
  return `${timeSlot} ${actionPlan}`;
}

function buildColor(seed, mood) {
  const random = createSeededRng(seed);
  const hue = mood === "positive"
    ? 95 + (random() * 80)
    : (random() < 0.5 ? random() * 18 : 342 + (random() * 18));
  const saturation = 58 + (random() * 30);
  const lightness = mood === "positive" ? 34 + (random() * 26) : 32 + (random() * 24);
  const hex = hslToHex(hue, saturation, lightness);

  const prefix = mood === "positive"
    ? pickFrom(POSITIVE_COLOR_PREFIX, random)
    : pickFrom(NEGATIVE_COLOR_PREFIX, random);
  const suffix = mood === "positive"
    ? pickFrom(POSITIVE_COLOR_SUFFIX, random)
    : pickFrom(NEGATIVE_COLOR_SUFFIX, random);

  return {
    name: `${prefix} ${suffix}`,
    hex,
  };
}

function getMoneyAura(score) {
  if (score >= 90) {
    return {
      band: "공격 구간",
      action: "기회 포인트를 적극 탐색",
    };
  }
  if (score >= 75) {
    return {
      band: "상승 구간",
      action: "소액 기회는 바로 실행",
    };
  }
  if (score >= 60) {
    return {
      band: "균형 구간",
      action: "충동지출만 차단",
    };
  }
  if (score >= 40) {
    return {
      band: "방어 구간",
      action: "지출 결정을 한 번 더 확인",
    };
  }
  return {
    band: "절약 구간",
    action: "불필요 소비는 보류",
  };
}

function getFortuneType(fortune) {
  if (fortune.pickupAmount >= 28000 && fortune.probabilityPercent <= 9.5) {
    return FORTUNE_TYPES.JACKPOT;
  }

  if (fortune.probabilityPercent >= 12 && fortune.pickupAmount <= 17000) {
    return FORTUNE_TYPES.SAVER;
  }

  if (fortune.luckyScore >= 72 && fortune.probabilityPercent >= 9) {
    return FORTUNE_TYPES.STABLE;
  }

  if (fortune.dailyFactor >= 1.14 || (fortune.luckyScore >= 56 && fortune.probabilityPercent >= 8)) {
    return FORTUNE_TYPES.TURNAROUND;
  }

  return FORTUNE_TYPES.RISK_ALERT;
}

function applyMoodTheme(score) {
  document.body.classList.remove("mood-positive", "mood-negative");
  if (typeof score !== "number") {
    return;
  }
  if (score >= 60) {
    document.body.classList.add("mood-positive");
    return;
  }
  document.body.classList.add("mood-negative");
}

function buildFortune(name, dobValue, todayInfo) {
  const fixedSeed = `${name}|${dobValue}`;
  const dailySeed = `${fixedSeed}|${todayInfo.dateKey}`;

  const fixedHash = hashFNV1a(fixedSeed);
  const dailyHash = hashFNV1a(dailySeed);

  const pickupBaseAmount = (10 + (fixedHash % 341)) * 100;
  const pickupTrend = 0.9 + (((fixedHash >>> 9) % 41) / 100);
  const dailyFactor = 0.85 + (((dailyHash + todayInfo.dayOfYear) % 56) / 100);
  const luckyScore = 1 + (dailyHash % 100);

  const pickupAmount = Math.max(
    100,
    Math.round((pickupBaseAmount * pickupTrend * (0.9 + (luckyScore / 250))) / 100) * 100,
  );
  const probabilityBase = 0.8 + ((dailyHash % 720) / 100);
  const probabilityPercent = Math.min(
    18.75,
    Number((probabilityBase * (0.65 + (dailyFactor / 1.9))).toFixed(2)),
  );
  const expectedValue = Math.max(
    10,
    Math.round(((pickupAmount * probabilityPercent) / 100) / 10) * 10,
  );

  return {
    pickupAmount,
    probabilityPercent,
    expectedValue,
    dailyFactor,
    luckyScore,
    fixedHash,
    dailyHash,
    inputKey: dailyHash.toString(16).toUpperCase().padStart(8, "0"),
  };
}

function createCalendarEntries(normalizedName, dobValue, todayInfo) {
  const baseUtc = parseDateKeyToUtc(todayInfo.dateKey);
  const entries = [];

  for (let offset = -7; offset <= 7; offset += 1) {
    const dateInfo = buildDateInfoFromUtc(baseUtc + (offset * DAY_MILLISECONDS));
    const fortune = buildFortune(normalizedName, dobValue, dateInfo);
    const type = getFortuneType(fortune);
    entries.push({
      offset,
      dateInfo,
      fortune,
      type,
      moodClass: fortune.luckyScore >= 60 ? "is-positive" : "is-negative",
    });
  }

  return entries;
}

function renderCalendar(normalizedName, dobValue, todayInfo) {
  if (!calendarGrid) {
    return;
  }

  const entries = createCalendarEntries(normalizedName, dobValue, todayInfo);
  const bestEntry = entries.reduce((best, current) => {
    if (!best) {
      return current;
    }
    return current.fortune.expectedValue > best.fortune.expectedValue ? current : best;
  }, null);

  calendarGrid.innerHTML = "";
  entries.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = `calendar-card ${entry.moodClass}`;
    card.style.setProperty("--delay", `${index * 12}ms`);

    if (entry.offset === 0) {
      card.classList.add("is-today");
    }

    if (bestEntry && entry.dateInfo.dateKey === bestEntry.dateInfo.dateKey) {
      card.classList.add("is-best");
    }

    const dayTitle = entry.offset === 0
      ? `오늘 · ${shortDateLabel(entry.dateInfo.dateKey)} (${entry.dateInfo.dayName})`
      : `${shortDateLabel(entry.dateInfo.dateKey)} (${entry.dateInfo.dayName})`;

    card.innerHTML = `
      <div class="calendar-day">${dayTitle}</div>
      <div class="calendar-amount">${krw.format(entry.fortune.pickupAmount)}</div>
      <div class="calendar-prob">발견 확률 ${entry.fortune.probabilityPercent.toFixed(2)}%</div>
      <div class="calendar-tag">${entry.type.name}</div>
    `;

    calendarGrid.appendChild(card);
  });

  if (bestEntry && calendarText) {
    calendarText.textContent = `추천일: ${bestEntry.dateInfo.dateKey} (${bestEntry.dateInfo.dayName}) · 예상 발견 금액 ${krw.format(bestEntry.fortune.pickupAmount)} · ${bestEntry.type.name}`;
  }
}

function setCalendarEmpty(message) {
  if (!calendarGrid) {
    return;
  }
  calendarGrid.innerHTML = `<div class="calendar-empty">${message}</div>`;
  setText(calendarText, message);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const rounded = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + rounded, y);
  context.lineTo(x + width - rounded, y);
  context.quadraticCurveTo(x + width, y, x + width, y + rounded);
  context.lineTo(x + width, y + height - rounded);
  context.quadraticCurveTo(x + width, y + height, x + width - rounded, y + height);
  context.lineTo(x + rounded, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - rounded);
  context.lineTo(x, y + rounded);
  context.quadraticCurveTo(x, y, x + rounded, y);
  context.closePath();
}

async function buildShareCardBlob(payload) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, payload.luckyHex);
  gradient.addColorStop(1, payload.badHex);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(255, 255, 255, 0.16)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(context, 84, 96, 912, 888, 36);
  context.fillStyle = "rgba(255, 255, 255, 0.94)";
  context.fill();

  context.fillStyle = "#10835f";
  context.font = "700 33px Sora, sans-serif";
  context.fillText("오늘의 길에서 돈을 주울 금전 운세", 138, 190);

  context.fillStyle = "#111827";
  context.font = "700 76px 'Cormorant Garamond', serif";
  context.fillText(payload.amount, 138, 302);

  context.font = "600 32px Sora, sans-serif";
  context.fillStyle = "#374151";
  context.fillText(`이름 ${payload.name}`, 138, 364);
  context.fillText(`날짜 ${payload.dateLabel}`, 138, 414);

  drawRoundedRect(context, 138, 468, 804, 124, 20);
  context.fillStyle = "rgba(16, 131, 95, 0.12)";
  context.fill();
  context.fillStyle = "#0f6a4d";
  context.font = "700 33px Sora, sans-serif";
  context.fillText(`${payload.typeName}`, 168, 544);
  context.fillStyle = "#1f2937";
  context.font = "500 28px Sora, sans-serif";
  context.fillText(payload.typeComment, 168, 582);

  drawRoundedRect(context, 138, 640, 804, 120, 20);
  context.fillStyle = "rgba(17, 24, 39, 0.08)";
  context.fill();
  context.fillStyle = "#111827";
  context.font = "600 28px Sora, sans-serif";
  context.fillText(`발견 확률 ${payload.probability}`, 168, 700);
  context.fillText(`행동 가이드 ${payload.aura}`, 168, 742);

  context.fillStyle = "#4b5563";
  context.font = "500 23px Sora, sans-serif";
  context.fillText("오락용 결과 공유 카드 · 실제 재무 판단 근거로 사용 금지", 138, 866);
  context.fillStyle = "#6b7280";
  context.font = "500 22px Sora, sans-serif";
  context.fillText("오늘 길에서 돈 줍는 확률 계산기", 138, 910);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function downloadBlob(blob, fileName) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

async function downloadResultCard() {
  if (!latestResult) {
    setShareStatus("먼저 결과를 계산해 주세요.", "error");
    return;
  }

  setShareButtonState(true);
  setShareStatus("공유 카드를 생성하고 있습니다.", "");

  try {
    const blob = await buildShareCardBlob(latestResult);
    if (!blob) {
      throw new Error("CARD_BLOB_FAILED");
    }

    const fileName = `gildon-${latestResult.dateLabel.split("-").join("")}.png`;
    downloadBlob(blob, fileName);
    setShareStatus("공유 카드 이미지가 저장되었습니다.", "success");
  } catch (_error) {
    setShareStatus("공유 카드 생성에 실패했습니다. 다시 시도해 주세요.", "error");
  } finally {
    setShareButtonState(false);
  }
}

function getShareUrl() {
  return SHARE_URL;
}

async function copyShareUrl() {
  const shareUrl = getShareUrl();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setShareStatus("공유 URL이 복사되었습니다.", "success");
  } catch (_error) {
    setShareStatus("URL 복사에 실패했습니다. 다시 시도해 주세요.", "error");
  }
}

function setResultEmpty(message) {
  if (resultPanel) {
    resultPanel.classList.remove("result-pop");
  }
  latestResult = null;
  setText(amountText, message);
  setText(nameText, "—");
  setText(hoursText, "—");
  setText(auraText, "—");
  setText(typeNameText, "—");
  setText(typeCommentText, "—");
  setText(benefactorText, "—");
  setText(cautionBenefactorText, "—");
  setText(luckyColorText, "—");
  setText(badColorText, "—");
  luckyColorChip.style.backgroundColor = "transparent";
  badColorChip.style.backgroundColor = "transparent";
  luckyColorChip.style.borderColor = "rgba(17, 24, 39, 0.15)";
  badColorChip.style.borderColor = "rgba(17, 24, 39, 0.15)";
  setText(ruleText, "—");
  setText(missionText, "—");
  setText(noteText, "—");
  setShareButtonState(false);
  setShareStatus(SHARE_DEFAULT_MESSAGE, "");
  setCalendarEmpty(CALENDAR_DEFAULT_MESSAGE);
  applyMoodTheme();
}

function syncToday() {
  const today = getKstTodayInfo();
  todayText.textContent = `${today.dateKey} (${today.dayName}) KST`;
  dobInput.max = today.dateKey;
  return today;
}

function compute() {
  const today = syncToday();
  const rawName = nameInput.value.trim();
  const normalizedName = normalizeName(rawName);
  const dobValue = dobInput.value;

  if (!normalizedName || !dobValue) {
    setResultEmpty("이름과 생년월일을 입력하세요.");
    return;
  }

  const birth = new Date(`${dobValue}T00:00:00`);
  if (Number.isNaN(birth.getTime())) {
    setResultEmpty("생년월일 형식이 올바르지 않습니다.");
    return;
  }

  if (dobValue > today.dateKey) {
    setResultEmpty("미래 날짜는 입력할 수 없습니다.");
    return;
  }

  const fortune = buildFortune(normalizedName, dobValue, today);
  const benefactor = buildBenefactor((fortune.dailyHash ^ fortune.fixedHash ^ 0xa2f9b23d) >>> 0);
  let cautionBenefactor = buildBenefactor((fortune.dailyHash ^ 0x51ed270b) >>> 0);
  if (cautionBenefactor.fullName === benefactor.fullName) {
    cautionBenefactor = buildBenefactor((fortune.fixedHash ^ 0x7f4a7c15) >>> 0);
  }
  const mission = buildMission((fortune.dailyHash ^ 0x9e3779b9) >>> 0);
  const luckyColor = buildColor((fortune.dailyHash ^ 0x13a5ba1d) >>> 0, "positive");
  const badColor = buildColor((fortune.fixedHash ^ 0x5f356495) >>> 0, "negative");
  const aura = getMoneyAura(fortune.luckyScore);
  const type = getFortuneType(fortune);
  applyMoodTheme(fortune.luckyScore);

  setText(amountText, krw.format(fortune.pickupAmount));
  setText(nameText, `${rawName} (${dobValue})`);
  setText(hoursText, `${fortune.probabilityPercent.toFixed(2)}%`);
  setText(auraText, `${fortune.luckyScore}점 · ${aura.band} (${aura.action})`);
  setText(typeNameText, type.name);
  setText(typeCommentText, type.comment);
  setText(benefactorText, benefactor.initials);
  setText(cautionBenefactorText, cautionBenefactor.initials);
  setText(luckyColorText, `${luckyColor.name} ${luckyColor.hex}`);
  setText(badColorText, `${badColor.name} ${badColor.hex}`);
  luckyColorChip.style.backgroundColor = luckyColor.hex;
  badColorChip.style.backgroundColor = badColor.hex;
  luckyColorChip.style.borderColor = luckyColor.hex;
  badColorChip.style.borderColor = badColor.hex;
  setText(ruleText, `발견 확률 ${fortune.probabilityPercent.toFixed(2)}% × 예상 발견 금액 ${krw.format(fortune.pickupAmount)} = 기대값 ${krw.format(fortune.expectedValue)}`);
  setText(missionText, mission);
  setText(noteText, "오락용 결과입니다. 확률/금액/귀인/색상 해석은 재미 요소이며 실제 재무 판단 근거로 사용하지 마세요.");
  setShareStatus("이미지 다운로드 또는 공유 URL 복사를 사용할 수 있습니다.", "");

  latestResult = {
    amount: krw.format(fortune.pickupAmount),
    dateLabel: today.dateKey,
    name: normalizeDisplayName(rawName),
    typeName: type.name,
    typeComment: type.comment,
    probability: `${fortune.probabilityPercent.toFixed(2)}%`,
    aura: `${aura.band} · ${aura.action}`,
    luckyHex: luckyColor.hex,
    badHex: badColor.hex,
  };

  renderCalendar(normalizedName, dobValue, today);
  triggerResultPop();
}

function resetForm() {
  nameInput.value = "";
  dobInput.value = "";
  syncToday();
  setResultEmpty(INITIAL_MESSAGE);
  nameInput.focus();
}

calcBtn.addEventListener("click", compute);
resetBtn.addEventListener("click", resetForm);
if (downloadCardBtn) {
  downloadCardBtn.addEventListener("click", downloadResultCard);
}
if (copyUrlBtn) {
  copyUrlBtn.addEventListener("click", copyShareUrl);
}
syncToday();
setResultEmpty(INITIAL_MESSAGE);



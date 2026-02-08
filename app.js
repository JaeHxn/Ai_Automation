const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const INITIAL_MESSAGE = "이름과 생년월일 입력 후 \"오늘 돈운 계산\"을 누르세요.";

const nameInput = document.getElementById("nameInput");
const dobInput = document.getElementById("dobInput");
const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");
const todayText = document.getElementById("todayText");

const amountText = document.getElementById("amountText");
const nameText = document.getElementById("nameText");
const ageText = document.getElementById("ageText");
const wageText = document.getElementById("wageText");
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

const MISSION_PREFIX = ["오늘", "지금", "오전 중", "점심 전", "퇴근 전", "잠들기 전"];
const MISSION_CATEGORY = ["지출", "저축", "부수입", "포인트", "고정비", "소비습관"];
const MISSION_TARGET = ["체크", "정리", "실행", "기록", "검토", "개선"];
const MISSION_ACTION = ["완료하기", "바로 적용하기", "하나만 끝내기", "5분 안에 시작하기", "메모에 남기기", "실천 후 캡처하기"];
const MISSION_OBJECT = ["구독 1개", "결제 내역", "장바구니", "중고 판매글", "적금 이체", "쿠폰함", "포인트 만료분", "외식비", "교통비", "커피 지출"];
const MISSION_METRIC = ["건", "분", "%", "원"];

const POSITIVE_COLOR_PREFIX = ["에메랄드", "민트", "세이지", "포레스트", "라임", "올리브", "그린티", "비리디언", "터콰이즈", "모스", "제이드", "클로버"];
const POSITIVE_COLOR_SUFFIX = ["플로우", "실크", "브리즈", "코어", "라이트", "톤", "미스트", "글로우", "딥", "펄스"];
const NEGATIVE_COLOR_PREFIX = ["버건디", "크림슨", "스칼렛", "와인", "브릭", "루비", "칠리", "마룬", "로즈우드", "가넷", "카민", "체리"];
const NEGATIVE_COLOR_SUFFIX = ["쉐이드", "딥", "스모그", "노이즈", "트랩", "베일", "블러", "폴", "터치", "브레이크"];

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

function normalizeName(name) {
  return name.trim().replace(/\s+/g, "").toLowerCase();
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
  const prefix = pickFrom(MISSION_PREFIX, random);
  const category = pickFrom(MISSION_CATEGORY, random);
  const target = pickFrom(MISSION_TARGET, random);
  const action = pickFrom(MISSION_ACTION, random);
  const object = pickFrom(MISSION_OBJECT, random);
  const metric = pickFrom(MISSION_METRIC, random);
  const amountBase = 1 + Math.floor(random() * 9);
  const amount = metric === "원" ? amountBase * 1000 : metric === "%" ? amountBase * 5 : amountBase * 3;
  return `${prefix} ${category} ${target}: ${object} ${amount}${metric} ${action}`;
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
    return "최상";
  }
  if (score >= 75) {
    return "좋음";
  }
  if (score >= 60) {
    return "무난";
  }
  if (score >= 40) {
    return "주의";
  }
  return "절약 모드";
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

  const baseAmount = (30 + (fixedHash % 271)) * 1000;
  const mixFactor = 0.8 + (((fixedHash >>> 8) % 91) / 100);
  const dailyFactor = 0.85 + (((dailyHash + todayInfo.dayOfYear) % 56) / 100);
  const luckyScore = 1 + (dailyHash % 100);

  const finalAmount = Math.round((baseAmount * mixFactor * dailyFactor) / 100) * 100;

  return {
    baseAmount,
    mixFactor,
    dailyFactor,
    luckyScore,
    finalAmount,
    fixedHash,
    dailyHash,
    inputKey: dailyHash.toString(16).toUpperCase().padStart(8, "0"),
  };
}

function setResultEmpty(message) {
  amountText.textContent = message;
  nameText.textContent = "—";
  ageText.textContent = "—";
  wageText.textContent = "—";
  hoursText.textContent = "—";
  auraText.textContent = "—";
  benefactorText.textContent = "—";
  cautionBenefactorText.textContent = "—";
  luckyColorText.textContent = "—";
  badColorText.textContent = "—";
  luckyColorChip.style.backgroundColor = "transparent";
  badColorChip.style.backgroundColor = "transparent";
  luckyColorChip.style.borderColor = "rgba(17, 24, 39, 0.15)";
  badColorChip.style.borderColor = "rgba(17, 24, 39, 0.15)";
  ruleText.textContent = "—";
  missionText.textContent = "—";
  noteText.textContent = "—";
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
  applyMoodTheme(fortune.luckyScore);

  amountText.textContent = krw.format(fortune.finalAmount);
  nameText.textContent = `${rawName} (${dobValue})`;
  ageText.textContent = `#${fortune.inputKey}`;
  wageText.textContent = krw.format(fortune.baseAmount);
  hoursText.textContent = `조합 ${fortune.mixFactor.toFixed(2)} × 오늘 ${fortune.dailyFactor.toFixed(2)}`;
  auraText.textContent = `${aura} (${fortune.luckyScore}점)`;
  benefactorText.textContent = benefactor.initials;
  cautionBenefactorText.textContent = cautionBenefactor.initials;
  luckyColorText.textContent = `${luckyColor.name} ${luckyColor.hex}`;
  badColorText.textContent = `${badColor.name} ${badColor.hex}`;
  luckyColorChip.style.backgroundColor = luckyColor.hex;
  badColorChip.style.backgroundColor = badColor.hex;
  luckyColorChip.style.borderColor = luckyColor.hex;
  badColorChip.style.borderColor = badColor.hex;
  ruleText.textContent = `${krw.format(fortune.baseAmount)} × ${fortune.mixFactor.toFixed(2)} × ${fortune.dailyFactor.toFixed(2)} (100원 반올림)`;
  missionText.textContent = mission;
  noteText.textContent = "오락용 결과입니다. 귀인/색상 해석은 재미 요소이며 실제 재무 판단 근거로 사용하지 마세요.";
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
syncToday();
setResultEmpty(INITIAL_MESSAGE);


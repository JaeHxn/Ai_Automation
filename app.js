const MIN_WAGE = 7.25;
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const INITIAL_MESSAGE = "이름과 생년월일 입력 후 \"실제 금액 계산\"을 누르세요.";

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
const ruleText = document.getElementById("ruleText");
const noteText = document.getElementById("noteText");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const day = DAY_NAMES[date.getDay()];
  return `${y}-${m}-${d} (${day})`;
}

function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function calcAge(birth, today) {
  let age = today.getFullYear() - birth.getFullYear();
  const monthGap = today.getMonth() - birth.getMonth();
  if (monthGap < 0 || (monthGap === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function getRule(age, isSchoolDay) {
  if (age < 14) {
    return {
      hours: 0,
      rule: "연방법 기준 14세 미만은 일반 비농업 취업 불가",
      note: "법적 제한으로 오늘 벌 수 있는 금액은 $0로 표시됩니다.",
    };
  }

  if (age <= 15) {
    if (isSchoolDay) {
      return {
        hours: 3,
        rule: "학교일 최대 3시간 (주중을 학교일로 근사)",
        note: "실제 학교 일정에 따라 달라질 수 있습니다.",
      };
    }
    return {
      hours: 8,
      rule: "비학교일 최대 8시간 (주말을 비학교일로 근사)",
      note: "실제 학교 일정에 따라 달라질 수 있습니다.",
    };
  }

  return {
    hours: 24,
    rule: "16세 이상은 연방법상 근로시간 제한 없음",
    note: "법적 상한이 없으므로 이론적 상한(24시간)을 표시합니다.",
  };
}

function setResultEmpty(message) {
  amountText.textContent = message;
  nameText.textContent = "—";
  ageText.textContent = "—";
  wageText.textContent = "—";
  hoursText.textContent = "—";
  ruleText.textContent = "—";
  noteText.textContent = "—";
}

function syncToday() {
  const today = getTodayDate();
  todayText.textContent = formatDate(today);
  dobInput.max = formatISO(today);
  return today;
}

function compute() {
  const today = syncToday();

  const name = nameInput.value.trim();
  const dobValue = dobInput.value;

  if (!name || !dobValue) {
    setResultEmpty("이름과 생년월일을 입력하세요.");
    return;
  }

  const birth = new Date(`${dobValue}T00:00:00`);
  if (Number.isNaN(birth.getTime())) {
    setResultEmpty("생년월일 형식이 올바르지 않습니다.");
    return;
  }

  if (birth > today) {
    setResultEmpty("미래의 날짜는 입력할 수 없습니다.");
    return;
  }

  const age = calcAge(birth, today);
  const day = today.getDay();
  const isSchoolDay = day >= 1 && day <= 5;

  const rule = getRule(age, isSchoolDay);
  const amount = rule.hours * MIN_WAGE;

  amountText.textContent = currency.format(amount);
  nameText.textContent = name;
  ageText.textContent = `${age}세`;
  wageText.textContent = `${currency.format(MIN_WAGE)} / 시간`;
  hoursText.textContent = `${rule.hours}시간`;
  ruleText.textContent = rule.rule;
  noteText.textContent = rule.note;
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

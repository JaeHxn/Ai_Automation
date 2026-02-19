import fs from "node:fs";
import path from "node:path";

const SITE = "https://ai-automation-djq.pages.dev";
const REVIEWED = "2026-02-19";

const posts = [
  {
    slug: "post-01-salary-day-budget",
    title: "월급날 24시간 예산 루틴",
    desc: "월급이 들어온 날 지출 흐름을 고정하는 실전 예산 루틴",
    sub: "월급일 하루의 선택이 한 달 소비 패턴을 결정합니다.",
    cat: "예산관리",
    read: 12,
    q: [
      "월급일 24시간 안에 저축·생활비·고정비를 분리하나요?",
      "주간 예산 상한선을 숫자로 정해두었나요?",
      "월중 점검일을 일정에 등록해 두었나요?",
    ],
    steps: [
      "입금 직후 고정비를 먼저 분리하고 사용 가능 금액을 계산합니다.",
      "저축 자동이체를 먼저 실행해 남는 돈이 아닌 먼저 남기는 구조를 만듭니다.",
      "생활비를 주간 단위로 쪼개서 초과를 빠르게 감지합니다.",
      "월중 1회 회고(저축률/충동구매 횟수)를 고정 일정으로 둡니다.",
    ],
    ex: [
      "월급 250만 원 기준으로 고정비 120만 원, 저축 45만 원을 먼저 분리",
      "남은 85만 원은 4주로 나눠 주간 21.25만 원으로 운영",
      "2주차 초과 시 4주차 여가비를 즉시 조정해 카드값 밀림 방지",
    ],
    mist: [
      ["월급일 계획 없이 즉시 소비 시작", "입금일 당일 상한선부터 확정하세요."],
      ["저축을 마지막에 하려고 함", "자동이체를 오전 시간대 우선 실행으로 바꾸세요."],
      ["월간 총액만 기억", "주간 단위로 분할해야 통제가 쉬워집니다."],
    ],
    mission: "다음 급여일 전에 자동이체 3개(저축·비상금·공과금)를 미리 예약하세요.",
  },
  {
    slug: "post-02-delivery-spend-control",
    title: "배달비·외식비 주간 제어법",
    desc: "배달비를 억지 금지 없이 줄이는 식비 운영 루틴",
    sub: "의지가 아니라 주문 직전 규칙을 바꾸는 것이 핵심입니다.",
    cat: "식비절감",
    read: 11,
    q: [
      "주문 전 냉장고 재고를 확인하는 습관이 있나요?",
      "배달/외식 예산을 하나의 상한선으로 관리하나요?",
      "주간 식비 초과 시 즉시 멈추는 규칙이 있나요?",
    ],
    steps: [
      "월간 식비를 주간 예산으로 분할합니다.",
      "배달앱 즐겨찾기를 2~3개 메뉴로 줄여 충동 선택을 줄입니다.",
      "주문 전 3분 체크(재고·쿠폰·필요성)를 적용합니다.",
      "주 2회 대체 식사를 고정해 배달 의존을 낮춥니다.",
    ],
    ex: [
      "월 식비 60만 원에서 46만 원으로 조정",
      "주문당 평균 2.1만 원에서 1.7만 원으로 하향",
      "주 2회 대체 식사로 월 8회 배달 대체",
    ],
    mist: [
      ["배달 완전 금지 선언", "반동 소비가 커지니 횟수·단가부터 줄이세요."],
      ["할인 문구만 보고 주문", "실결제 총액 기준으로 판단하세요."],
      ["월말에만 식비 확인", "주간 단위로 봐야 초과를 빨리 잡습니다."],
    ],
    mission: "오늘 배달앱 즐겨찾기 메뉴를 정리하고 대체 메뉴 2개를 메모해 두세요.",
  },
  {
    slug: "post-03-subscription-cleanup-checklist",
    title: "구독 서비스 정리 체크리스트",
    desc: "자동결제 구독을 정리하고 재가입 기준을 세우는 가이드",
    sub: "작은 금액의 반복 결제가 고정비를 빠르게 키웁니다.",
    cat: "고정비관리",
    read: 11,
    q: [
      "지난 30일 사용 여부를 바로 말할 수 있나요?",
      "같은 목적의 구독을 중복 결제하고 있나요?",
      "해지 후 재가입 조건을 문장으로 정해 두었나요?",
    ],
    steps: [
      "최근 2개월 자동결제 목록을 모두 수집합니다.",
      "업무 필수/편의/취미로 구독을 그룹화합니다.",
      "사용빈도 점수로 해지 후보를 뽑습니다.",
      "재가입 기준을 미리 문서화해 감정 결제를 막습니다.",
    ],
    ex: [
      "8개 구독을 4개로 정리해 월 57,000원에서 31,000원으로 감소",
      "중복 기능 구독을 가족요금제로 전환",
      "해지 후 2주 사용 불편 기록으로 필요한 항목만 재가입",
    ],
    mist: [
      ["한 번에 모두 해지", "핵심 서비스까지 잃지 않게 우선순위 해지를 하세요."],
      ["결제일 확인 없이 정리", "결제 직전 주간 점검이 효과적입니다."],
      ["재가입 규칙 없음", "조건이 없으면 감정적 재결제가 반복됩니다."],
    ],
    mission: "오늘 자동결제 목록을 스프레드시트 1장으로 정리해 보세요.",
  },
  {
    slug: "post-04-secondhand-selling-guide",
    title: "중고 판매로 생활비 회수하기",
    desc: "안 쓰는 물건을 현금 흐름으로 전환하는 단계별 판매 가이드",
    sub: "중고 판매는 절약보다 빠르게 현금흐름을 개선할 수 있습니다.",
    cat: "현금흐름",
    read: 12,
    q: [
      "최근 6개월 사용하지 않은 물건을 분류해봤나요?",
      "가격을 감으로 정하지 않고 최근 거래가를 확인하나요?",
      "안전 거래 원칙(장소·결제)을 정해 두었나요?",
    ],
    steps: [
      "카테고리별로 판매 우선순위를 정합니다.",
      "사진은 전면/측면/하자 부위를 포함해 촬영합니다.",
      "유사 제품 최근 거래가 5건 이상을 비교해 가격을 설정합니다.",
      "무응답 3~4일 후 단계적으로 가격을 조정합니다.",
    ],
    ex: [
      "2주 동안 7개 물건 판매, 총 23만 원 회수",
      "사진 품질 개선 후 문의율이 첫 주 대비 2배 이상 증가",
      "보관 공간 확보와 불필요 소비 욕구 감소 효과",
    ],
    mist: [
      ["하자 정보를 숨김", "분쟁 위험이 커지므로 하자를 먼저 공개하세요."],
      ["급하게 큰 폭 할인", "기준 없는 인하는 손해가 큽니다. 단계 조정이 안전합니다."],
      ["거래 조건 늦게 고지", "장소·시간·결제 방식을 등록 시점에 명시하세요."],
    ],
    mission: "오늘 판매할 물건 3개를 고르고 사진 촬영부터 시작하세요.",
  },
  {
    slug: "post-05-card-benefit-routine",
    title: "카드 혜택 루틴 자동화",
    desc: "복잡한 카드 혜택을 누락 없이 챙기는 실사용 중심 운영법",
    sub: "혜택은 기억이 아니라 결제 전 루틴으로 관리해야 유지됩니다.",
    cat: "카드관리",
    read: 10,
    q: [
      "카드별 대표 사용처를 1~2개로 정해두었나요?",
      "전월 실적 조건을 주간 단위로 추적하나요?",
      "할인 때문에 불필요한 소비를 한 적이 있나요?",
    ],
    steps: [
      "카드 수를 목적별 3장 이하로 축소합니다.",
      "카드별 대표 사용처를 고정해 결제 실수를 줄입니다.",
      "결제 전 5초 체크(필요성/혜택/예산)를 습관화합니다.",
      "주 1회 실적 점검으로 조건 미달을 조기 수정합니다.",
    ],
    ex: [
      "카드 5장을 3장 체계로 정리해 관리 복잡도 감소",
      "잘못된 카드 결제 건수 월 7건에서 월 2건으로 감소",
      "체감 할인액 월 1.8만 원 증가",
    ],
    mist: [
      ["혜택 카드 계속 추가", "카드 수가 늘면 누락이 늘어납니다. 먼저 단순화하세요."],
      ["월말에만 실적 확인", "수정 여지가 적습니다. 주간 점검으로 앞당기세요."],
      ["할인율만 보고 선택", "연회비·조건·사용빈도를 함께 봐야 실익이 보입니다."],
    ],
    mission: "오늘 사용할 카드 1장을 미리 지정해 결제 실수를 줄이세요.",
  },
  {
    slug: "post-06-emergency-fund-30days",
    title: "30일 비상금 만들기",
    desc: "소액 자동이체와 지출 조정으로 30일 비상금 습관을 만드는 계획",
    sub: "큰 목표보다 자동으로 쌓이는 구조가 먼저입니다.",
    cat: "저축습관",
    read: 11,
    q: [
      "비상금 계좌가 소비 계좌와 분리되어 있나요?",
      "하루 소액 자동이체를 바로 실행할 수 있나요?",
      "비상금 사용 조건을 문장으로 정해 두었나요?",
    ],
    steps: [
      "1주차에 전용 계좌와 자동이체를 설정합니다.",
      "2주차에 불필요 지출 2개를 줄여 이체액을 보강합니다.",
      "3주차에 지출 급등 요일을 찾아 사전 상한선을 적용합니다.",
      "4주차에 누적액·실패원인을 기록하고 다음 달 목표를 조정합니다.",
    ],
    ex: [
      "하루 2,000원 자동이체로 30일 6만 원 확보",
      "변동비 절감 6만 원을 추가해 총 12만 원 비상금 형성",
      "충동구매 건수 8건에서 3건으로 감소",
    ],
    mist: [
      ["초기 목표 과도 설정", "실패 경험이 누적되므로 작은 목표부터 시작하세요."],
      ["비상금 계좌 혼용", "생활비와 섞이면 인출이 쉬워집니다. 분리가 필수입니다."],
      ["실패일 미기록", "원인을 모르면 개선이 어렵습니다. 실패 패턴을 남기세요."],
    ],
    mission: "오늘 비상금 전용 계좌를 만들고 자동이체를 1건 등록하세요.",
  },
  {
    slug: "post-07-transport-communication-savings",
    title: "교통비·통신비 리셋 가이드",
    desc: "한 번 점검하면 매달 효과가 누적되는 고정비 절감 가이드",
    sub: "고정비는 의지가 아니라 점검 순서가 절감 성과를 만듭니다.",
    cat: "고정비절감",
    read: 11,
    q: [
      "교통비에서 정기권/환승 할인 적용 여부를 확인했나요?",
      "통신 데이터 실사용량을 3개월 이상 비교했나요?",
      "약정 종료일과 위약금 조건을 확인했나요?",
    ],
    steps: [
      "2주 교통 로그를 수집해 불필요 이동을 찾습니다.",
      "정기권·환승·모바일 교통카드 옵션을 비교합니다.",
      "통신은 최근 3개월 사용량으로 요금제를 재산정합니다.",
      "변경 후 1개월 동안 품질과 절감액을 함께 점검합니다.",
    ],
    ex: [
      "교통 정기권 전환으로 월 2.1만 원 절감",
      "요금제 조정+결합할인으로 통신비 월 6.5만 원 절감",
      "연간 100만 원 이상 고정비 절감 효과",
    ],
    mist: [
      ["추천 요금제만 그대로 유지", "실사용량 기준 재산정이 먼저입니다."],
      ["총액만 보고 원인 미분해", "이동 목적별/시간대별 분석이 필요합니다."],
      ["변경 후 품질 검증 생략", "불편하면 재상향될 수 있어 추적이 필요합니다."],
    ],
    mission: "오늘 통신앱에서 최근 3개월 사용량 캡처를 남겨두세요.",
  },
  {
    slug: "post-08-weekend-spend-reset",
    title: "주말 소비 리셋 루틴",
    desc: "주말 과소비를 줄이고 월요일 후회를 줄이는 3일 소비 루틴",
    sub: "주말 소비는 즉흥성이 높아 사전 설계가 중요합니다.",
    cat: "소비습관",
    read: 10,
    q: [
      "금요일에 주말 잔여 예산을 확인하나요?",
      "토요일 과소비 시 일요일 보정 규칙이 있나요?",
      "주말 지출 원인을 기록하는 습관이 있나요?",
    ],
    steps: [
      "금요일 밤 10분 동안 주말 총예산을 확정합니다.",
      "토요일 오전 필수/선택 일정을 분리합니다.",
      "결제 전 10초 멈춤 규칙(필요성/대체안/잔액)을 적용합니다.",
      "일요일 저녁 다음 주 보정 계획을 바로 설정합니다.",
    ],
    ex: [
      "주말 예산 사전 확정으로 충동 결제 감소",
      "4주 운영 후 주말 평균 지출 21만 원에서 12.6만 원으로 감소",
      "월요일 카드 알림 스트레스가 크게 완화",
    ],
    mist: [
      ["주말을 보상 소비로만 사용", "대체 활동을 준비해 소비 의존을 줄이세요."],
      ["토요일 과소비 후 포기", "일요일 보정 루틴으로 주간 예산을 복구하세요."],
      ["원인 기록 생략", "원인을 알아야 재발을 줄일 수 있습니다."],
    ],
    mission: "이번 금요일 밤 10분, 주말 예산부터 먼저 정해보세요.",
  },
  {
    slug: "post-09-cafe-expense-reduction",
    title: "카페 지출 줄이는 3단계",
    desc: "커피를 끊지 않고도 월 카페비를 줄이는 단가·빈도·대체 전략",
    sub: "카페비는 금지보다 기준 메뉴와 방문 규칙이 더 효과적입니다.",
    cat: "생활지출",
    read: 10,
    q: [
      "기준 메뉴 1개를 정해두었나요?",
      "주간 방문 횟수 상한선을 가지고 있나요?",
      "대체 음료 루틴을 준비했나요?",
    ],
    steps: [
      "기준 메뉴를 정하고 옵션 추가를 최소화합니다.",
      "주간 방문 횟수 상한선을 적용합니다.",
      "주 2회 대체 음료(홈카페/텀블러)를 고정합니다.",
      "월 1회 카드 내역에서 카페 항목만 분리 분석합니다.",
    ],
    ex: [
      "평균 결제 단가 5,800원에서 4,300원으로 조정",
      "주 7회 방문을 주 4회로 축소",
      "월 카페비 18만 원에서 10.5만 원으로 감소",
    ],
    mist: [
      ["카페 완전 금지", "반동 소비 가능성이 커서 단계적 감축이 안전합니다."],
      ["횟수만 줄이고 단가 방치", "단가·옵션 관리가 함께 필요합니다."],
      ["쿠폰·적립 확인 누락", "반복 지출일수록 누적 효과가 큽니다."],
    ],
    mission: "오늘부터 기준 메뉴 1개를 정하고 1주일만 유지해 보세요.",
  },
  {
    slug: "post-10-beginner-investment-risk-check",
    title: "투자 전 리스크 점검표",
    desc: "초보 투자자가 먼저 확인해야 할 손실 관리 체크리스트",
    sub: "수익률보다 먼저 점검할 것은 손실을 감당할 구조입니다.",
    cat: "리스크관리",
    read: 13,
    q: [
      "비상금 3~6개월치가 분리 보관되어 있나요?",
      "투자금과 생활비를 물리적으로 분리했나요?",
      "매수·매도 조건을 숫자로 문서화했나요?",
    ],
    steps: [
      "재무 안전망(생활비·부채·비상금)을 먼저 점검합니다.",
      "거래당 손실 허용 한도를 수치로 설정합니다.",
      "분산 원칙과 보유 기간 기준을 문서화합니다.",
      "거래 후 24시간 내 의사결정 근거를 기록합니다.",
    ],
    ex: [
      "체크리스트 10항목 중 8항목 이상 충족 시에만 진입",
      "손실 한도 도달 시 자동 비중 축소",
      "3개월 후 충동 진입 건수 60% 감소",
    ],
    mist: [
      ["수익 사례만 보고 진입", "실패 시나리오와 회복 가능성을 먼저 확인하세요."],
      ["손절 기준 없음", "사전 기준이 없으면 손실이 커집니다."],
      ["과도한 집중 투자", "분산 원칙이 생존 확률을 높입니다."],
    ],
    mission: "투자 실행 전 손실 한도와 매도 조건을 한 문장으로 먼저 적으세요.",
  },
];

function esc(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

const bySlug = new Map(posts.map((post) => [post.slug, post]));
const related = {
  "post-01-salary-day-budget": ["post-02-delivery-spend-control", "post-06-emergency-fund-30days"],
  "post-02-delivery-spend-control": ["post-01-salary-day-budget", "post-08-weekend-spend-reset"],
  "post-03-subscription-cleanup-checklist": ["post-05-card-benefit-routine", "post-07-transport-communication-savings"],
  "post-04-secondhand-selling-guide": ["post-01-salary-day-budget", "post-06-emergency-fund-30days"],
  "post-05-card-benefit-routine": ["post-03-subscription-cleanup-checklist", "post-09-cafe-expense-reduction"],
  "post-06-emergency-fund-30days": ["post-01-salary-day-budget", "post-04-secondhand-selling-guide"],
  "post-07-transport-communication-savings": ["post-03-subscription-cleanup-checklist", "post-08-weekend-spend-reset"],
  "post-08-weekend-spend-reset": ["post-02-delivery-spend-control", "post-09-cafe-expense-reduction"],
  "post-09-cafe-expense-reduction": ["post-02-delivery-spend-control", "post-05-card-benefit-routine"],
  "post-10-beginner-investment-risk-check": ["post-01-salary-day-budget", "post-06-emergency-fund-30days"],
};

function li(items) {
  return items.map((item) => `\n        <li>${esc(item)}</li>`).join("");
}

function rows(items) {
  return items
    .map(([a, b]) => `\n          <tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`)
    .join("");
}

function links(slug) {
  return (related[slug] || [])
    .map((s) => {
      const post = bySlug.get(s);
      if (!post) {
        return "";
      }
      return `\n        <a href="${post.slug}.html"><strong>${esc(post.title)}</strong><span>${esc(post.desc)}</span></a>`;
    })
    .join("");
}

function articleLd(post) {
  const published = post.published || "2026-02-08";
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.desc,
      inLanguage: "ko-KR",
      datePublished: published,
      dateModified: REVIEWED,
      mainEntityOfPage: `${SITE}/blog/${post.slug}.html`,
      author: { "@type": "Organization", name: "나의 금전 운세 편집팀", url: `${SITE}/editorial-policy.html` },
      publisher: { "@type": "Organization", name: "나의 금전 운세 테스트", url: `${SITE}/` },
    },
    null,
    2,
  );
}

function renderPost(post) {
  const published = post.published || "2026-02-08";
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(post.title)} | 블로그</title>
  <meta name="description" content="${esc(post.desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="google-adsense-account" content="ca-pub-5354319294441406">
  <link rel="canonical" href="${SITE}/blog/${post.slug}.html">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="나의 금전 운세 테스트">
  <meta property="og:title" content="${esc(post.title)}">
  <meta property="og:description" content="${esc(post.desc)}">
  <meta property="og:url" content="${SITE}/blog/${post.slug}.html">
  <meta property="og:image" content="${SITE}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(post.title)}">
  <meta name="twitter:description" content="${esc(post.desc)}">
  <meta name="twitter:image" content="${SITE}/og-image.svg">
  <link rel="stylesheet" href="../styles.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5354319294441406" crossorigin="anonymous"></script>
  <script type="application/ld+json">
${articleLd(post)}
  </script>
</head>
<body>
  <main class="shell">
    <header class="hero" id="top">
      <nav class="site-nav" aria-label="주요 메뉴">
        <a class="brand" href="../index.html">금전 운세</a>
        <div class="nav-links">
          <a href="index.html">블로그</a>
          <a href="../index.html#calculator">계산기</a>
          <a href="../methodology.html">계산 방법</a>
          <a href="../editorial-policy.html">편집 원칙</a>
          <a href="../about.html">서비스 소개</a>
          <a href="../contact.html">문의</a>
        </div>
      </nav>
      <div class="badge">BLOG POST</div>
      <h1>${esc(post.title)}</h1>
      <p class="subtitle">${esc(post.sub)}</p>
      <p class="today">게시일: ${published} · 최종 검토: ${REVIEWED} · 읽기 ${post.read}분</p>
      <p class="hero-note">작성: 나의 금전 운세 편집팀 · 이 글은 생활 재무 습관 개선을 위한 일반 정보 콘텐츠입니다.</p>
      <div class="chip-row">
        <span class="topic-chip">카테고리 ${esc(post.cat)}</span>
        <span class="topic-chip">검토 기준 분기 1회</span>
      </div>
    </header>

    <article class="panel article-body">
      <h2>왜 이 주제가 중요한가</h2>
      <p>${esc(post.title)}은(는) 단순 절약 팁이 아니라 반복되는 지출 패턴을 구조적으로 바꾸기 위한 실천 가이드입니다. 목표는 극단적인 소비 금지가 아니라, 같은 생활 수준을 유지하면서도 재무 안정성을 높이는 것입니다.</p>
      <p>이 글은 짧은 동기부여 문구가 아니라 실제 적용 가능한 절차를 중심으로 작성했습니다. 점검 질문, 실행 순서, 실패 패턴, 주간 체크리스트를 함께 제시해 사용자 환경에 맞춰 바로 적용할 수 있게 구성했습니다.</p>

      <h2>먼저 점검할 질문</h2>
      <ul class="plain-list">${li(post.q)}
      </ul>

      <h2>실행 절차</h2>
      <ol class="plain-list ordered-list">${li(post.steps)}
      </ol>

      <h2>실전 예시</h2>
      <div class="info-box">
        <ul class="plain-list">${li(post.ex)}
        </ul>
      </div>

      <h2>자주 실패하는 패턴과 수정 방법</h2>
      <div class="table-wrap">
        <table class="insight-table">
          <thead>
            <tr>
              <th>실패 패턴</th>
              <th>수정 방법</th>
            </tr>
          </thead>
          <tbody>${rows(post.mist)}
          </tbody>
        </table>
      </div>

      <h2>7일 체크리스트</h2>
      <ul class="plain-list">
        <li>이번 주 핵심 목표 1개를 숫자로 정의했다.</li>
        <li>지출 초과 시 바로 조정할 항목을 미리 정했다.</li>
        <li>주간 점검일을 캘린더에 등록했다.</li>
        <li>충동 결제 전 10초 대기 규칙을 적용했다.</li>
        <li>결과를 기록하고 다음 주 기준을 보정했다.</li>
      </ul>

      <h2>오늘 실행 미션</h2>
      <p>${esc(post.mission)}</p>
      <p class="footer-note">안내: 본문은 일반 정보 제공 목적이며, 개인의 소득·부채·가구 상황에 따라 적용 방식이 달라질 수 있습니다.</p>
    </article>

    <section class="panel">
      <h2>관련 글</h2>
      <div class="related-links">${links(post.slug)}
      </div>
    </section>
`;
}

function renderIndex() {
  const cards = posts
    .map(
      (post, i) => `
        <article class="blog-post-card">
          <div class="blog-card-head">
            <span class="topic-chip">${esc(post.cat)}</span>
            <span class="card-meta">읽기 ${post.read}분</span>
          </div>
          <h3>${i + 1}. <a href="${post.slug}.html">${esc(post.title)}</a></h3>
          <p>${esc(post.desc)}</p>
          <ul class="plain-list">
            <li>${esc(post.steps[0])}</li>
            <li>${esc(post.steps[1])}</li>
          </ul>
          <div class="footer-links compact-links">
            <a href="${post.slug}.html">본문 보기</a>
            <a href="../editorial-policy.html">편집 원칙</a>
            <a href="../methodology.html">계산 방법</a>
          </div>
        </article>`,
    )
    .join("\n");

  const ld = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "실천형 돈관리 블로그",
      url: `${SITE}/blog/`,
      inLanguage: "ko-KR",
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE}/blog/${post.slug}.html`,
        datePublished: post.published || "2026-02-08",
        dateModified: REVIEWED,
      })),
    },
    null,
    2,
  );

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>블로그 | 오늘의 길에서 돈을 주울 금전 운세</title>
  <meta name="description" content="생활 재무 루틴을 다루는 실천형 블로그 10편입니다.">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="google-adsense-account" content="ca-pub-5354319294441406">
  <link rel="canonical" href="${SITE}/blog/">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="오늘의 길에서 돈을 주울 금전 운세">
  <meta property="og:title" content="실천형 돈관리 블로그">
  <meta property="og:description" content="실행 가능한 생활 재무 루틴 10편을 제공합니다.">
  <meta property="og:url" content="${SITE}/blog/">
  <meta property="og:image" content="${SITE}/og-image.svg">
  <link rel="stylesheet" href="../styles.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5354319294441406" crossorigin="anonymous"></script>
  <script type="application/ld+json">
${ld}
  </script>
</head>
<body>
  <main class="shell">
    <header class="hero" id="top">
      <nav class="site-nav" aria-label="주요 메뉴">
        <a class="brand" href="../index.html">금전 운세</a>
        <div class="nav-links">
          <a href="../index.html#calculator">계산기</a>
          <a href="index.html">블로그</a>
          <a href="../methodology.html">계산 방법</a>
          <a href="../editorial-policy.html">편집 원칙</a>
          <a href="../about.html">서비스 소개</a>
          <a href="../contact.html">문의</a>
        </div>
      </nav>
      <div class="badge">BLOG</div>
      <h1>실천형 돈관리 블로그</h1>
      <p class="subtitle">오락성 운세 결과와 분리된 독립 정보 콘텐츠입니다.</p>
      <p class="hero-note">최종 콘텐츠 검토일: ${REVIEWED} · 모든 글은 실행 루틴과 체크리스트를 포함합니다.</p>
      <div class="chip-row">
        <span class="topic-chip">카테고리 10개</span>
        <span class="topic-chip">실전 글 10편</span>
        <span class="topic-chip">분기별 정기 검토</span>
      </div>
    </header>

    <section class="panel">
      <h2>이용 안내</h2>
      <ul class="plain-list">
        <li>본문은 일반 정보 제공 목적이며, 개별 상황에 맞게 조정해 적용해야 합니다.</li>
        <li>정책·표현 오류 제보는 문의 페이지로 접수할 수 있습니다.</li>
        <li>편집 원칙과 계산 한계는 별도 페이지에서 공개합니다.</li>
      </ul>
    </section>

    <section class="panel">
      <h2>최신 게시물 10선</h2>
      <div class="blog-post-grid">
${cards}
      </div>
    </section>

    <section class="panel">
      <h2>품질 및 투명성 페이지</h2>
      <div class="policy-grid">
        <a class="policy-card" href="../editorial-policy.html">
          <strong>편집 원칙</strong>
          <span>작성 기준, 검토 절차, 정정 정책</span>
        </a>
        <a class="policy-card" href="../methodology.html">
          <strong>계산 방법</strong>
          <span>운세 계산 로직, 입력값 범위, 해석 한계</span>
        </a>
        <a class="policy-card" href="../contact.html">
          <strong>정정 요청/문의</strong>
          <span>오류 신고, 개선 제안, 정책 문의 접수</span>
        </a>
      </div>
    </section>

    <footer class="site-footer">
      <p>© 오늘의 길에서 돈을 주울 금전 운세</p>
      <div class="footer-links">
        <a href="../index.html">홈</a>
        <a href="../editorial-policy.html">편집 원칙</a>
        <a href="../methodology.html">계산 방법</a>
        <a href="../contact.html">문의</a>
      </div>
    </footer>
  </main>
</body>
</html>
`;
}

const blogDir = path.resolve("blog");
for (const post of posts) {
  const filePath = path.join(blogDir, `${post.slug}.html`);
  const rendered = `${renderPost(post)}
    <section class="panel">
      <h2>콘텐츠 투명성</h2>
      <ul class="plain-list">
        <li>편집 원칙과 수정 정책은 <a href="../editorial-policy.html">편집 원칙</a> 페이지에서 공개합니다.</li>
        <li>운세 계산 결과의 한계는 <a href="../methodology.html">계산 방법</a> 페이지에서 확인할 수 있습니다.</li>
        <li>오류 제보와 정정 요청은 <a href="../contact.html">문의 페이지</a>를 통해 접수됩니다.</li>
      </ul>
    </section>

    <footer class="site-footer">
      <p>© 나의 금전 운세 테스트</p>
      <div class="footer-links">
        <a href="index.html">블로그 홈</a>
        <a href="../index.html">메인 홈</a>
        <a href="../editorial-policy.html">편집 원칙</a>
        <a href="../contact.html">문의</a>
      </div>
    </footer>
  </main>
</body>
</html>
`;
  fs.writeFileSync(filePath, rendered, "utf8");
}

fs.writeFileSync(path.join(blogDir, "index.html"), renderIndex(), "utf8");
console.log(`Updated ${posts.length} blog posts and index.`);

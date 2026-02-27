# AdSense 재심사 체크리스트 (2026-02-27)

## 1) 배포 전 확인
- `node scripts/policy-audit.mjs`
- `node scripts/policy-audit.mjs --prepublish`
- `rg -n "pagead2.googlesyndication.com" -S -g "*.html"` 결과가 비어 있는지 확인

## 2) 색인 대상 URL
- `https://ai-automation-djq.pages.dev/`
- `https://ai-automation-djq.pages.dev/blog/`
- `https://ai-automation-djq.pages.dev/blog/post-01-salary-day-budget.html`
- `https://ai-automation-djq.pages.dev/blog/post-02-delivery-spend-control.html`
- `https://ai-automation-djq.pages.dev/blog/post-06-emergency-fund-30days.html`
- `https://ai-automation-djq.pages.dev/blog/post-08-weekend-spend-reset.html`
- `https://ai-automation-djq.pages.dev/about.html`
- `https://ai-automation-djq.pages.dev/methodology.html`
- `https://ai-automation-djq.pages.dev/editorial-policy.html`
- `https://ai-automation-djq.pages.dev/privacy.html`
- `https://ai-automation-djq.pages.dev/contact.html`

## 3) Search Console 작업 순서
1. 위 11개 URL URL 검사 실행
2. 색인 요청 제출
3. `sitemap.xml` 재제출
4. 수동 조치(Manual actions) 보고서 이상 없음 확인

## 4) AdSense 재심사 제출문 (복사본)
저가치 콘텐츠 사유를 해소하기 위해 사이트 구조와 콘텐츠를 전면 수정했습니다. 반복 템플릿 중심이던 블로그를 사용자 실행 가치가 높은 4개 고유 콘텐츠로 재작성했고, 품질 기준 미충족 6개 페이지는 noindex 처리 및 사이트맵 제외를 적용했습니다. 개선 기간 동안 광고 스크립트를 임시 제거하여 콘텐츠 품질 신호를 우선 반영했으며, 운영자 정보(운영팀), 정정 절차, 개인정보/문의 정책을 명확히 공개했습니다. 현재 색인 대상 페이지는 모두 고유 콘텐츠와 명확한 탐색 구조를 갖추도록 정비했습니다.

## 5) 재심사 후 모니터링
- 72시간 내 Search Console 색인 상태 변화 점검
- 7일 내 크롤링 오류/링크 오류/정책 경고 재점검
- 공개 4편 중 사용자 반응이 낮은 글부터 다음 개정 우선순위 지정

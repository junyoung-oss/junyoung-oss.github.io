# Noel Jun Project
## 07_tech_stack.md

---

# 1. Technical Direction


## Goal

Noel Jun 사이트는 단순한 정적 포트폴리오가 아닌,

계속 성장하고 업데이트되는
개인 브랜드 플랫폼으로 제작한다.


필요 조건:


- 유지보수가 쉬울 것
- 확장 가능할 것
- 개발 경험을 보여줄 수 있을 것
- 콘텐츠 관리가 편할 것
- 빠른 속도를 유지할 것


---

# 2. Recommended Stack


## Frontend


### Next.js


선택 이유:


- React 기반
- 현대적인 웹 개발 방식
- SEO 최적화 가능
- 페이지 관리 편리
- 확장성이 좋음


사용 목적:


- Portfolio Page
- Blog
- Project Archive
- Animation


---

# 3. Language


## TypeScript


선택 이유:


- 코드 안정성 증가
- 유지보수 편리
- 엔지니어링 역량 표현 가능


---

# 4. Styling


## Tailwind CSS


선택 이유:


- 빠른 UI 제작
- 일관된 디자인 관리
- 반응형 구현 편리


사용 영역:


- Layout
- Component
- Animation


---

# 5. Animation


## Framer Motion


사용 목적:


- Hero Animation
- Scroll Animation
- Page Transition


Principle:


"화려함보다 자연스러운 경험"


---

# 6. Content Management


## Markdown 기반 관리


선택 이유:


- Git 관리 가능
- 작성 쉬움
- 개발 블로그 확장 가능


Structure:
content/
├── about.md
├── journey.md
├── projects/
│   ├── qa-automation.md
│   └── game-qa.md
├── blog/
│   └── article.md

---

# 7. Deployment


## Vercel


선택 이유:


- Next.js 최적화
- 자동 배포
- GitHub 연동
- 빠른 배포


Flow:
Local Development

↓

GitHub Push

↓

Vercel Deploy

↓

Production

---

# 8. Repository Structure


Example:

Noel_Jun_Project

├── app

│   ├── page.tsx

│   ├── about

│   ├── projects

│   └── blog

├── components

│   ├── Header

│   ├── Hero

│   ├── Card

│   └── Timeline

├── content

│   ├── about

│   ├── projects

│   └── blog

├── public

│   └── images

├── styles

└── README.md

---

# 9. Privacy / Access Control


## Requirement


개인 정보 보호를 위해
검색 노출과 접근 제한 고려


---

## Public Version


공개 가능 영역:


- 자기소개
- 경력
- 기술
- 공개 프로젝트


---

## Private Version


제한 공개 영역:


- 상세 프로젝트
- 업무 화면
- 상세 Case
- 내부 문서 예시


---

# Recommended Solution


## Option 1

Secret URL 방식


예: noeljun.dev/private/project

장점:

- 간단함
- 공유 편리


단점:

- 링크가 노출되면 접근 가능


---

## Option 2

Password Protection


사용:


- Vercel Middleware
- Auth System


장점:

- 보안 강화


단점:

- 관리 필요


---

# Recommended


초기:

Public + Secret URL


이후:

필요 시 Password Protection 추가


---

# 10. Blog System


## Initial


Markdown Blog


관리:

GitHub


작성: YYYY-MM-DD-title.md

---

## Future Expansion


가능:


- CMS 연결
- Notion API
- Admin Page


---

# 11. SEO


설정:


- Metadata
- Open Graph Image
- Sitemap
- robots.txt


목표:


검색했을 때


"Noel Jun"


이라는 브랜드 검색 가능


---

# 12. Development Environment


## Required


Node.js

npm / pnpm

Git


---

# 13. Future Expansion


가능한 기능:


## Career Timeline

성장 과정 시각화


## Interactive Resume

경험 선택형 이력서


## AI Chatbot

"Noel Jun 소개하기"


## Dashboard

학습 기록 관리


---

# Final Technical Goal


기술을 보여주기 위한 사이트가 아니라,

기술을 활용해
나라는 사람을 표현하는 사이트를 만든다.
